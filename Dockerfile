FROM oven/bun:1.2.8

COPY . .
RUN bun install
EXPOSE 3000
CMD ["bun", "run", "start"]
