# rafaelfnaves.dev

Personal portfolio of Rafael Naves: hero, Skills, Projects and a contact form, in pt-BR (default) and English, light and dark.

- Next.js (App Router) · TypeScript · Tailwind · next-intl · next-themes
- Contact form: Server Action → Cloudflare Turnstile + decoy field + rate limit → Resend
- Design tokens follow [`references/DESIGN.md`](references/DESIGN.md); domain terms live in [`GLOSSARY.md`](GLOSSARY.md)
- Hosting: Docker Compose + Cloudflare Tunnel on an Oracle Cloud ARM instance ([ADR 0001](docs/adr/0001-self-host-with-compose-and-cloudflare-tunnel.md))

## Development

```bash
corepack enable
pnpm install
cp .env.example .env.local   # Turnstile test keys work out of the box
pnpm dev
```

Without `RESEND_API_KEY` the form gets all the way to sending and then shows the "couldn't send" error, which is expected locally.

| Script           | What it does                                               |
| ---------------- | ---------------------------------------------------------- |
| `pnpm test`      | Vitest: contact form logic (validation, decoy, rate limit) |
| `pnpm test:e2e`  | Playwright smoke test against a production build           |
| `pnpm lint`      | ESLint                                                     |
| `pnpm typecheck` | `tsc --noEmit`                                             |
| `pnpm format`    | Prettier                                                   |

Copy lives in `messages/pt-BR.json` and `messages/en.json`; skill and project data in `src/content/`.

## Deployment

Every push to `main` runs the tests, builds a `linux/arm64` image on a native ARM runner, pushes it to GHCR (`:latest` and `:<sha>`), then SSHes into the server to `docker compose pull && up -d`. Pull requests only run the tests.

### One-time setup

**1. Server (Oracle Cloud, Ubuntu aarch64)**

```bash
# Docker Engine + Compose plugin
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER   # log out and back in

mkdir -p ~/portfolio && cd ~/portfolio
cat > .env <<'EOF'
RESEND_API_KEY=re_...
TURNSTILE_SECRET_KEY=0x...
CLOUDFLARE_TUNNEL_TOKEN=eyJ...
EOF
chmod 600 .env
```

Only SSH (22) needs to be reachable, for the deploy job; web traffic arrives through the tunnel, which connects outward.

**2. Cloudflare**

- **Tunnel:** Zero Trust → Networks → Tunnels → _Create a tunnel_ (cloudflared). Copy the token into `CLOUDFLARE_TUNNEL_TOKEN`. Add a public hostname `rafaelfnaves.dev` → service `http://web:3000`. Cloudflare creates the DNS record.
- **Turnstile:** Turnstile → _Add widget_ for `rafaelfnaves.dev` (managed or invisible mode). The site key goes in the GitHub variable below; the secret key goes in the server's `.env`.
- **Web Analytics:** Analytics & Logs → Web Analytics → add `rafaelfnaves.dev` and enable automatic setup. Cloudflare injects the beacon on proxied traffic, so no token is needed in the code.

**3. Resend**

Add the domain `rafaelfnaves.dev`, then add the DNS records it shows (DKIM/SPF) in Cloudflare and wait for it to verify. Create an API key with _sending access_ and put it in the server's `.env`. Messages are sent from `contact@rafaelfnaves.dev` to `r.naves21@gmail.com`; override them with `CONTACT_FROM` / `CONTACT_TO` if needed.

**4. GitHub** (repo → Settings)

Create an environment named `production` with these secrets:

| Secret            | Value                                                                                                |
| ----------------- | ---------------------------------------------------------------------------------------------------- |
| `SSH_HOST`        | Server public IP or hostname                                                                         |
| `SSH_USER`        | e.g. `ubuntu`                                                                                        |
| `SSH_PRIVATE_KEY` | A deploy key (`ssh-keygen -t rsa -b 4096`); its `.pub` goes in the server's `~/.ssh/authorized_keys` |
| `SSH_KNOWN_HOSTS` | Output of `ssh-keyscan <SSH_HOST>`                                                                   |

Add a repository **variable** `TURNSTILE_SITE_KEY` with the public site key, which is baked into the client bundle at build time.

The deploy job logs the server into GHCR with the run's short-lived token, so the image can stay private.

### Rolling back

```bash
cd ~/portfolio
IMAGE=ghcr.io/rafaelfnaves/portfolio-rfn:<previous-sha> docker compose up -d
```
