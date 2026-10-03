# Cloud Dashboard quickstart

## Prerequisites

- Node.js 22.12 or newer
- npm
- Git

## Install and run

```powershell
git clone https://github.com/HunterProX/cloud-dashboard.git
cd cloud-dashboard
npm ci
Copy-Item .env.example .env.local
npm run dev
```

Open <http://localhost:3000>. The dashboard works without an API key.

## Validate

```powershell
npm run lint
npm run typecheck
npm test
npm run check:pii
npm run build
```

Browser tests are optional and require a local Chromium installation:

```powershell
npx playwright install chromium
npm run test:e2e
```

## Configuration

`AI_INSIGHTS_ENABLED=false` is the safe default. Do not enable a public AI
endpoint without authentication, rate limiting, usage limits, and a provider
retention review. Never use a `NEXT_PUBLIC_` prefix for a provider key.

## Boundary

All metrics are deterministic synthetic data. This is a public reproduction,
not live cloud telemetry, client infrastructure, real cost reporting, or proof
of historical employer operations.
