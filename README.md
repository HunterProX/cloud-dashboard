# Cloud Dashboard

A **local-first cloud observability prototype** built with Next.js, TypeScript,
Tailwind CSS, shadcn/ui-style components, Recharts, and optional server-side AI
summaries.

> **Demo limitation:** every metric, service, alert, timestamp, and trend in this
> repository is deterministic sample data. This app does not connect to AWS,
> Azure, GCP, Kubernetes, Prometheus, or any live infrastructure. It does not
> report real cloud usage or cost.

## What works

- Responsive observability dashboard with CPU, memory, request-volume, and
  availability cards.
- Fixed, deterministic chart series and sample service/alert activity.
- Locally adjustable CPU and memory alert thresholds.
- Optional AI explanation based only on the generated sample metrics. The AI
  endpoint is disabled unless explicitly enabled on the server.
- Accessible loading/error states, reduced-motion support, unit tests, and
  browser-flow tests.

## Stack

- Next.js App Router, React, and TypeScript
- Tailwind CSS v4 and local shadcn/ui-style Button/Card primitives
- Recharts and Motion for React
- Vercel AI SDK with the OpenAI provider (optional; server-side only)
- Zod, Vitest, and Playwright
- GitHub Actions, Gitleaks, and a focused source/fixture privacy scan

## Run locally

Requirements: Node.js 22.12+ and npm.

```bash
git clone https://github.com/HunterProX/cloud-dashboard.git
cd cloud-dashboard
npm ci
cp .env.example .env.local
npm run dev
```

Open <http://localhost:3000>. AI summaries are off by default; the rest of the
dashboard works without an API key.

### Optional AI summary

Set these server-only values in `.env.local`:

```env
AI_INSIGHTS_ENABLED=true
OPENAI_API_KEY=your_server_side_key
OPENAI_MODEL=gpt-4o-mini
```

Restart the development server after changing environment variables. Do not
prefix the key with `NEXT_PUBLIC_`. The endpoint accepts no user-supplied metric
payload and only sends the built-in synthetic values to the provider.

**Do not enable AI on a public deployment without external authentication or
rate limiting and usage limits.** This prototype does not provide production
abuse protection. No deployment is included or implied by this repository.

## Validation

```bash
npm run lint
npm run typecheck
npm test
npm run check:pii
npm run build
```

Run browser tests with:

```bash
npx playwright install chromium
npm run test:e2e
```

The privacy check detects common email, SSN, API-key, AWS-key, private-key, and
`NEXT_PUBLIC_*KEY/SECRET/TOKEN` patterns in tracked and untracked text files.
It is a guardrail, not a general-purpose PII classifier. Gitleaks scans Git
history and changed content in CI.

## Not implemented

- Live cloud account integrations or telemetry
- Real-time updates, persistent data, or real cloud-cost calculations
- AWS/GCP/Azure infrastructure, Kubernetes, Helm, Terraform, or Prometheus
- Authentication, multi-tenancy, or production authorization
- Production AI abuse controls, Sentry monitoring, or deployment automation

The existing public demo URL may represent an earlier deployment and is not
verified by this source tree. No live-demo claim is made here.
