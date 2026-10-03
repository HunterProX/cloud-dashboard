import { describe, expect, it } from "vitest";
import { dashboardSnapshotSchema, getDemoSnapshot } from "@/lib/dashboard-metrics";

describe("demo dashboard metrics", () => {
  it("returns deterministic data that is explicitly marked as simulated", () => {
    const first = getDemoSnapshot();
    const second = getDemoSnapshot();

    expect(first).toEqual(second);
    expect(first.demoMode).toBe(true);
    expect(first.label).toBe("SIMULATED DATA");
    expect(first.metrics).toHaveLength(4);
    expect(first.series).toHaveLength(12);
    expect(first.metrics.every((metric) => Number.isFinite(metric.value))).toBe(true);
  });

  it("rejects percentage values outside their valid range", () => {
    const snapshot = getDemoSnapshot();
    const invalidSnapshot = {
      ...snapshot,
      metrics: snapshot.metrics.map((metric) =>
        metric.unit === "%" ? { ...metric, value: 101 } : metric,
      ),
    };

    expect(dashboardSnapshotSchema.safeParse(invalidSnapshot).success).toBe(false);
  });
});
