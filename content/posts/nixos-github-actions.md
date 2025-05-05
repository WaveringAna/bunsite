---
author: waveringana
date: 2025-05-05
title: Setting up multiple self-hosted Github runners on NixOS
excerpt:
---

Github makes it hard to setup multiple runners across your repositories if you use their bundled downloads. It ends up being a crappy script that competes with other instances despite running within a docker container. NixOS has a solution for this with [a bundled service](https://search.nixos.org/options?channel=24.11&show=services.github-runners&from=0&size=50&sort=relevance&type=packages&query=services.github-runner) but there's little documentation for this. I aim to fill that gap here as it solves a massive need for me.

The Systemd service it creates contains the self‑contained Runner.Listener binary that ships with every Actions release. However what is available to the service is bare and is something that has to be given to its path. This is exactly how Nix manages services to make them reproducible, and this is how the way Nix works clicked in my head. Nix packages live under long store prefixes (`/nix/store/<hash>-foo-1.2.3/bin`). The “global” login‑shell path points to many packages, but services often don’t need all of them and should not accidentally pick up something you installed for unrelated reasons. Therefore NixOS exposes the helper option `systemd.services.<name>.path` (the Github Actions module wraps it in extraPackages) so you can declare exactly which binaries a unit may invoke. 

Something like this:

```nix
{
  runner1 = {
    enable = true;
    name = "runner1";
    tokenFile = "/secrets/token1";
    url = "https://github.com/owner/repo";
  };
  runner2 = {
    enable = true;
    name = "runner2";
    tokenFile = "/secrets/token2";
    url = "https://github.com/owner/repo";
  };
}
```

creates two bare runners. If you point an existing workflow at them it will blow up immediately because even basic utilities like `curl` and `shasum` are missing from the unit’s `PATH`. That's why you would need to define extraPackages for the runners to use.

I distribute my projects via Docker (I feel there's no need to distribute raw binaries since anyone who wants that definitely knows how to build projects and can follow my readme), so here are the packages I define that I've found to include enough of the essentials:

```nix
{ lib, pkgs, ... }:

let extraPackages =
  let gtar = pkgs.runCommandNoCC "gtar" { } ''
    mkdir -p $out/bin
    ln -s ${lib.getExe pkgs.gnutar} $out/bin/gtar
  '';
  in
  with pkgs; [
    nix
    nixci
    cachix
    coreutils
    which
    jq
    gtar
    docker
    curl
    perl
  ];
in
{
  services.github-runners = {
    runner1 = {
      enable     = true;
      name       = "runner1";
      url        = "https://github.com/USERNAME/REPONAME";
      tokenFile  = "/var/lib/github-runner/build-token";
      user = "regent";
      group = "docker";
      extraPackages = extraPackages;
      ephemeral = true; # Creates a new runner on new jobs
    };
  };
}
```

I've found that these include enough essentials to get Docker based actions to run. Setting `group = "docker"` implicitly disables DynamicUser, so the unit runs under the real user (which in my case is regent) and inherits group docker to access the socket. Here is my Action and Docker files for a Rust based project:

```yml
name: Docker

on:
  schedule:
    - cron: "38 9 * * *"
  push:
    branches: ["main"]
    tags: ["v*.*.*"]
  pull_request:
    branches: ["main"]
  release:
    types: [published]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build:
    runs-on: self-hosted
    permissions:
      contents: read
      packages: write
      id-token: write

    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Install cosign
        if: github.event_name != 'pull_request'
        uses: sigstore/cosign-installer@v3.8.1
        with:
          cosign-release: "v2.4.3"

      - name: Setup Docker buildx
        uses: docker/setup-buildx-action@v3

      - name: Log into registry ${{ env.REGISTRY }}
        if: github.event_name != 'pull_request'
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Log in to Docker Hub
        if: github.event_name != 'pull_request'
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Extract metadata (tags, labels) for Docker
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: |
            ${{ env.IMAGE_NAME }}
            ${{ env.REGISTRY }}/${{ github.repository }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v6
        with:
          context: .
          file: ./Dockerfile
          platforms: linux/amd64,linux/arm64
          push: ${{ github.event_name != 'pull_request' }}
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
```

Dockerfile
```dockerfile
# Frontend build stage
FROM oven/bun:latest AS frontend-builder

WORKDIR /usr/src/frontend

# Copy frontend files
COPY frontend/package.json ./
RUN bun install

COPY frontend/ ./

# Build frontend with production configuration
ARG API_URL=http://localhost:8080
ENV VITE_API_URL=${API_URL}
RUN bun run build

# Rust build stage
FROM rust:latest AS backend-builder

# Install PostgreSQL client libraries and SSL dependencies
RUN apt-get update && \
    apt-get install -y pkg-config libssl-dev libpq-dev && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

# Copy manifests first (better layer caching)
COPY Cargo.toml Cargo.lock ./

# Copy source code and SQLx prepared queries
COPY src/ src/
COPY migrations/ migrations/
COPY .sqlx/ .sqlx/

# Create static directory and copy frontend build
COPY --from=frontend-builder /usr/src/frontend/dist/ static/

# Build the application
RUN cargo build --release

# Runtime stage
FROM debian:bookworm-slim

# Install runtime dependencies
RUN apt-get update && \
    apt-get install -y libpq5 ca-certificates openssl libssl3 && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy the binary from builder
COPY --from=backend-builder /usr/src/app/target/release/simplelink /app/simplelink

# Copy migrations folder for SQLx
COPY --from=backend-builder /usr/src/app/migrations /app/migrations

# Copy static files
COPY --from=backend-builder /usr/src/app/static /app/static

# Expose the port
EXPOSE 8080

# Set default network configuration
ENV SERVER_HOST=0.0.0.0
ENV SERVER_PORT=8080

# Run the binary
CMD ["./simplelink"]
```

It built perfectly on my m4 mini with nix-darwin.
![Success result of Docker based Github Action](/public/github-action.png)