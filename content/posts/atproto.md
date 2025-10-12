---
author: Ana
date: 2025-10-12
title: On AppViews, Clients, and the Missing Tooling
excerpt:  If we're building a protocol that's supposed to give users control over their data and their view of the network, we should be building toward a future where appviews are optional—a convenience for those who want them, not a requirement for participating in the network.
---
The AT Protocol community draws a careful distinction between "appviews" and "clients." An appview is the collection of records assembled by backfilling from Personal Data Servers (PDSs) and consuming from the firehose—the aggregated, indexed view of the network. A client pulls from the appview and presents it to users.

But I keep asking: why this distinction? Why not just call both the client?

The answer, as I understand it, is architectural. The appview does heavy lifting—indexing, aggregation, search, feed generation—that would be impractical for individual clients to perform. The client stays lightweight, focused on presentation and user interaction, while the appview handles the computational work of making sense of the distributed data.

This makes sense as an engineering choice. But it obscures something important: from the user's perspective, both the appview and the client are intermediaries operating on their behalf, neither of which they directly control.

Bitcoin's distinction between full nodes and light wallets provides a useful parallel. A full node stores and validates the entire blockchain independently. A light wallet trusts someone else to do that work, querying their node for relevant information. But crucially: both models preserve self-custody. The light wallet still controls the private keys, still constructs and signs transactions locally, still maintains authority over the funds—it just broadcasts those transactions through someone else's full node instead of its own. The full node can do the same work but broadcast independently. The trust trade-off is about validation and network visibility, not about control over assets. The terminology is honest about what you're trusting others to do (validate the chain, relay transactions) versus what remains in your control (keys, signing, transaction construction).

AT could benefit from similar clarity. The current framing suggests that appviews are infrastructure (neutral, necessary) while clients are applications (personal, chosen). But appviews aren't neutral—they make editorial decisions about what to index, how to rank content, what to surface. They're not only infrastructure; they're intermediaries with power over what users see. We see it in the never ending discourse that this month has been embroiled in that I simply don't care about anymore.

More importantly, the architecture assumes users need these intermediaries. And maybe most users do—running the equivalent of a full node is work most people don't want to do. But the protocol doesn't seem (keyword here) to make it easy for users who do want to interact directly with their PDS, to run their own indexing, to control their own view of the network without trusting an appview operator.

This is where tooling matters. The distinction between appview and client becomes meaningful only if we also build tools that let users bypass appviews entirely when they choose to. Otherwise, we've just created a distributed system where users still depend on centralized intermediaries, and we've obscured that dependence by splitting it across two layers instead of one.

What would it look like to build clients that interact directly with PDSs? Not as the default—most users won't want that complexity—but as an option for those who do. Tools that let you index your own view of the network, query PDSs directly, validate records yourself. The equivalent of running a full node, with all the trade-offs that entails.

PDSls is great sure. I don't know if i have further thoughts about this. Maybe a similar tool with UI components to render records like bluesky posts?

Right now, the protocol's architecture seems to assume that appviews are necessary, that the computational work they do is too heavy for individual users or clients. But that's a claim about current tooling, not about fundamental constraints. If we're building a protocol that's supposed to give users control over their data and their view of the network, we should be building toward a future where appviews are optional—a convenience for those who want them, not a requirement for participating in the network.

The bitcoin world got this right by being honest about the distinction and building tooling for both models. AT Protocol could do the same: call appviews what they are (trusted intermediaries), build clients that can work with or without them, and create tools that make it progressively easier for users to reduce their dependence on appviews if they choose to.