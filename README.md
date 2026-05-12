# Serout — Frontend

Short description: Serout is a Next.js 14 TypeScript frontend for intent-parsing and Solana interactions. It uses Groq LLM for natural-language intent parsing, Jupiter v6 for swaps, and Solana Web3 for blockchain interactions.

**Tech Stack**
- **Framework**: Next.js 14 (App Router) · TypeScript
- **Styling**: Tailwind CSS
- **Blockchain**: Solana Web3.js · Jupiter v6
- **AI**: Groq LLM via `groq-sdk`

**Quick Links**
- **Project root**: [App/frontend](App/frontend)
- **Groq client**: [lib/groq/client.ts](lib/groq/client.ts#L1)
- **Solana connection**: [lib/solana/connection.ts](lib/solana/connection.ts#L1)
- **Jupiter helper**: [lib/jupiter.ts](lib/jupiter.ts#L1)

**Prerequisites**
- Node.js >= 18
- Yarn or npm
- A Groq API key and (optionally) a Jupiter API key for swap features.

**Environment Variables**
Create a `.env.local` at `App/frontend/.env.local` with the following values (example):

```
GROQ_API_KEY=gsk_your_key_here
JUPITER_API_KEY=jup_your_key_here
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_SOLANA_NETWORK=devnet
# Legacy / alternate names kept for compatibility (optional)
NEXT_PUBLIC_RPC_URL=https://api.devnet.solana.com
SOLANA_RPC_URL=https://api.devnet.solana.com
```

- **GROQ_API_KEY**: required for Groq LLM calls (used in `lib/groq/client.ts`).
- **JUPITER_API_KEY**: optional, required for swap endpoints in `lib/jupiter.ts`.
- **NEXT_PUBLIC_SOLANA_RPC_URL**: public RPC URL used by browser code and providers.

Note: This repo contains multiple names for RPC vars for historical compatibility. `NEXT_PUBLIC_SOLANA_RPC_URL` is the primary env referenced throughout the codebase.

**Local setup**
1. Install dependencies

```bash
cd App/frontend
yarn install
# or
npm install
```

2. Add `.env.local` (see Environment Variables above).

3. Run development server

```bash
yarn dev
# or
npm run dev
```

Open http://localhost:3000.

**Project structure (high-level)**
- `app/` — Next.js app routes and API handlers (`app/api/*/route.ts`).
- `components/` — Reusable UI components and providers.
- `lib/` — Business logic and SDK wrappers (Groq, Jupiter, Solana utilities).
	- `lib/groq/` — Groq client and parsing helpers.
	- `lib/solana/` — Connection and transaction utilities.
	- `lib/jupiter.ts` — Helpers to call Jupiter swap APIs.
- `hooks/` — React hooks used across the UI.
- `public/` — Static assets.

**Key files**
- `app/api/chat/route.ts` — API route that calls Groq intent parser.
- `lib/groq/client.ts` — Wraps Groq SDK and exposes `parseIntent()`.
- `lib/solana/connection.ts` — Builds connection using `NEXT_PUBLIC_SOLANA_RPC_URL`.

**Testing**
- Unit tests (where present) live near their modules (e.g., `lib/groq/client.test.ts`).
- To run tests: `yarn test` or `npm test` (project-specific test scripts may vary).

**Deployment notes**
- Ensure env vars are set in your hosting platform (Vercel, Netlify, etc.).
- Keep API keys secret — never commit `.env.local` to source control.

**Troubleshooting**
- Groq errors: confirm `GROQ_API_KEY` is valid and not rate-limited.
- RPC connectivity: if `NEXT_PUBLIC_SOLANA_RPC_URL` is unreachable, fallback uses devnet cluster helper.

**Contributing**
- Open issues and PRs; keep changes small and focused. Document env changes in this README.

**License & Contact**
- Add project license here.
- For questions, contact the maintainers or open an issue.

---

If you want, I can:
- add a short 'How it works' diagram or architecture section,
- expand the 'Development' section with lint/format/test commands, or
- remove legacy env names and update code to use a single canonical env variable.
