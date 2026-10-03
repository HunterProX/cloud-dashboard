# Configuration reference

| Variable | Required | Default | Secret | Purpose |
|---|---:|---|---:|---|
| `AI_INSIGHTS_ENABLED` | No | `false` | No | Enables optional server-side summary path |
| `OPENAI_API_KEY` | No | empty | Yes | Provider key when AI is explicitly enabled |
| `OPENAI_MODEL` | No | `gpt-4o-mini` | No | Provider model identifier |

Local configuration belongs in `.env.local`, which must not be committed.
Production configuration requires a separate security review.
