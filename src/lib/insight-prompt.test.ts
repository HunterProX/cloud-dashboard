import { describe, expect, it } from "vitest";
import { getDemoSnapshot } from "@/lib/dashboard-metrics";
import { buildInsightPrompt } from "@/lib/insight-prompt";

describe("buildInsightPrompt", () => {
  it("identifies the metrics as simulated and forbids claims of live telemetry", () => {
    const prompt = buildInsightPrompt(getDemoSnapshot());

    expect(prompt).toContain("SIMULATED DATA");
    expect(prompt).toMatch(/do not claim|must not claim/i);
    expect(prompt).toMatch(/real cloud|live telemetry/i);
  });

  it("includes the supplied metric labels, values, and units", () => {
    const prompt = buildInsightPrompt(getDemoSnapshot());

    for (const metric of getDemoSnapshot().metrics) {
      expect(prompt).toContain(metric.label);
      expect(prompt).toContain(String(metric.value));
      expect(prompt).toContain(metric.unit);
    }
  });
});
