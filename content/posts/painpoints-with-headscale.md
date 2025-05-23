---
author: waveringana
date: 2025-05-23
title: My Painpoints with Headscale
excerpt: 
---

When I discovered Tailscale, I instantly fell in love with it because it saves me 3-5 hours every week by automating the provisioning and management of WireGuard clients. It's not surprising that Tailscale has inspired open-source alternatives, such as [NetBird](https://netbird.io) and [Pangolin](https://github.com/fosrl/pangolin), that offer similar functionality with additional features.

However, many Tailscale users have noticed [a humorous yet horrifying design issue](https://www.reddit.com/r/Tailscale/comments/1ksy3xy/someone_just_randomly_joined_my_tailnet/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button) (I don't even want to call it a flaw). If a new user signs up using an email from a domain already associated with an existing account, the new account is automatically added to the other person's tailnet. This happens unless the domain is on a manually maintained blacklist (e.g., gmail.com). While this behavior might simplify the sign-up process for organizations, it should be be opt-in and secured by domain TXT verifications rather than automatically adding users without their explicit consent. 

[Tailscale responded quickly](https://www.reddit.com/r/Tailscale/comments/1ksy3xy/comment/mtqd4et/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button) (3 hours) acknowleding that this "this sucks" and that they're in the midst of making this problem go away entirely through their reworking of their identity model. And Tailscale always had ways to ensure this doesn't happen like mandating admin review of new users, and their excellent ACL feature to control what nodes can do, yet the former not being on by default for years (its on by default now) is also another design issue that I cannot fathom why its like that.

This clearly demonstrates the need for a project like [Headscale](https://github.com/juanfont/headscale), along with other similar initiatives (such as NetBird, Pangolin, and others). Headscale is designed as a reverse-engineered Tailscale control server that you can easily self-host, allowing you to continue using Tailscale's excellent open-source clients. However, there are certain aspects of Tailscale that I miss, which I plan to outline below (honestly for myself) in hopes of finding potential fixes or opportunities to contribute improvements:

1. No `tailscale cert` to provision https certs for accessing machines based on their MagicDNS, (GitHub issue #2527)[https://github.com/juanfont/headscale/issues/2527]
2. No easy way to horizontally scale, only vertically, and the SQLite DB it uses is an incredible bottleneck when you have 100-200+ clients. Headscale dev says HS isn't built for this. (Fair enough honestly and I guess this is why Tailscale is happy to support HS, its an on-ramp for their enterprise pricing) (Issue #2571)[https://github.com/juanfont/headscale/issues/2571] (Issue #2491)[https://github.com/juanfont/headscale/issues/2491] (Headscale Docs about Scaling)[https://headscale.net/development/about/faq/#scaling-how-many-clients-does-headscale-support]
3. Tags are very broken and is something I gave up on using pretty quickly. Admittetly I did not spend much time figuring out why or how, just that I got so many issues I became frustrated and gave up. 
4. Restarting the instance after every config change
5. Can't use OIDC groups in ACLs (I don't actually know if TS supports this either) (Github Issue #2366)[https://github.com/juanfont/headscale/issues/2366]
6. Security Audit! I'd love to contribute to a crowdfund for this.