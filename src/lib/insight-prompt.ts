import type { DashboardSnapshot } from "@/lib/dashboard-metrics";

export function buildInsightPrompt(snapshot: DashboardSnapshot) {
  const metrics = snapshot.metrics
    .map((metric) => `- ${metric.label}: ${metric.value}${metric.unit} (${metric.status})`)
    .join("\n");
  const recentTrend = snapshot.series
    .slice(-6)
    .map((point) => `${point.time}: CPU ${point.cpu}%, memory ${point.memory}%, requests ${point.requests}/min`)
    .join("\n");

  return `You are an observability assistant explaining a portfolio dashboard prototype.
The following data is ${snapshot.label}. It is deterministic sample data, not live telemetry.
Do not claim or imply that it comes from a real cloud account, real service, or real-time monitoring.
Do not invent causes, incidents, savings, or operational actions. Distinguish observations from suggestions.
Write a concise 2-3 sentence summary for an engineer. Mention one notable trend and one cautious next check if useful.

Current simulated metrics:
${metrics}

Recent simulated trend:
${recentTrend}`;
}
