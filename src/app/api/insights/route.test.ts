import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/insights/route";

describe("POST /api/insights", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("is disabled by default and does not call a model", async () => {
    vi.stubEnv("AI_INSIGHTS_ENABLED", "false");
    vi.stubEnv("OPENAI_API_KEY", "");
    vi.stubEnv("OPENAI_MODEL", "");

    const response = await POST();
    const body = await response.json();

    expect(response.status).toBe(503);
    expect(body.error).toMatch(/disabled/i);
    expect(response.headers.get("cache-control")).toBe("no-store");
  });
});
