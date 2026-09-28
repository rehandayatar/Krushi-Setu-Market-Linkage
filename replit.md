# Krushi Setu

Krushi Setu is a functional public-service prototype that helps farmers move from verified mandi prices to trusted buyers, group selling, and auditable transaction records.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server.
- `pnpm --filter @workspace/krushi-setu run dev` — run the web app.
- `pnpm run typecheck` — typecheck the workspace.
- `pnpm run build` — build the workspace.
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI contract.

The configured workflows are `artifacts/api-server: API Server` and `artifacts/krushi-setu: web`.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5 with generated OpenAPI client/hooks
- Web: React, Vite, Wouter, TanStack Query, Tailwind
- Validation and client generation: Zod and Orval from `lib/api-spec/openapi.yaml`
- Current prototype storage: in-memory API state

## Where things live

- `artifacts/krushi-setu/src/App.tsx` — product routes, role workspaces, P0 journey wiring, and demo interactions.
- `artifacts/krushi-setu/src/index.css` — Krushi Setu visual system and responsive styles.
- `artifacts/api-server/src/lib/krushi-data.ts` — seeded prototype records and mutable in-memory state.
- `artifacts/api-server/src/routes/krushi.ts` — Krushi Setu API routes and mutation handlers.
- `lib/api-spec/openapi.yaml` — source-of-truth API contract.

## Architecture decisions

- Uploaded Krushi Setu requirements and the master prompt are authoritative; the implementation preserves the complete P0 journey before lower-priority expansion.
- Market data is provider-shaped and explicitly labelled prototype/demo data so Agmarknet/eNAM or another approved provider can replace the seeded source later.
- Transaction integrity is represented as a blockchain-inspired append-only ledger with chained hashes; it is not presented as a public decentralized blockchain.
- Demo authentication uses the fixed accounts below and does not collect real Aadhaar, payment credentials, or other sensitive identity data.
- The API remains in-memory for this immediately runnable prototype; mutations reset when the API workflow restarts.

## Product

The prototype includes:

- Farmer price discovery with mandi comparison, crop history, local offers, cost planning, soil, weather, diagnosis, and Sahayak access.
- Buyer discovery with verification/trust signals, group-sale opportunities, bid capture, transaction views, and buyer profile context.
- Group selling with pooled quantities, buyer offers, offer acceptance, and transaction creation.
- Transaction proof with simulated payment status, previous/current hashes, and integrity verification language.
- Sahayak-assisted access and a government/admin view for markets, farmers, buyers, transactions, reports, schemes, adoption, and impact analytics.
- Responsive desktop/mobile navigation, loading/error/empty/offline states, prototype badges, and multilingual affordances.

### Demo accounts

All demo accounts use the password `password123`:

- Farmer: `farmer@krushisetu.demo` → `/farmer/login`
- Buyer: `buyer@krushisetu.demo` → `/buyer/login`
- Sahayak: `sahayak@krushisetu.demo` → `/sahayak/login`
- Admin: `admin@krushisetu.demo` → `/admin/login`

## User preferences

- Keep prototype/demo data visibly labelled and avoid implying live government data.

## Gotchas

- The seeded records are intentionally mutable during a demo journey, but they are not restart-persistent.
- Run API and web workflows together; the generated frontend hooks expect the API server’s `/api` routes.
- If the OpenAPI contract changes, run API codegen before typechecking the generated client.

## Pointers

- API contract: `lib/api-spec/openapi.yaml`
- Frontend artifact: `artifacts/krushi-setu`
- API artifact: `artifacts/api-server`
