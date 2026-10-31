# Self-host on Oracle Cloud with Docker Compose and Cloudflare Tunnel

The portfolio runs as a Docker image (built for `linux/arm64` on GitHub's native ARM runners, published to GHCR) on an Oracle Cloud Ampere instance, started with Docker Compose and exposed to `rafaelfnaves.dev` through a Cloudflare Tunnel; GitHub Actions deploys over SSH on every push to `main`.

We chose this over Vercel (the server and domain already exist, and the instance is free) and over Kamal, which Rafael uses in other projects: the instance hosts nothing else, so there is no kamal-proxy to share, and a tunnel lets the server keep ports 80/443 closed and leave TLS to Cloudflare.

## Consequences

- Because the app runs as a single container, the contact form's rate limit can live in memory. The client IP is read from Cloudflare's `CF-Connecting-IP` header.
- If more apps land on this instance later, revisit Kamal.
