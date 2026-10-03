import { describe, expect, it } from "vitest";
import { isAIInsightsEnabled } from "@/lib/ai-config";

describe("AI insight configuration", () => {
  it("stays disabled unless explicitly enabled with a key and model", () => {
    expect(isAIInsightsEnabled({})).toBe(false);
    expect(
      isAIInsightsEnabled({
        AI_INSIGHTS_ENABLED: "true",
        OPENAI_API_KEY: "test-key",
      }),
    ).toBe(false);
    expect(
      isAIInsightsEnabled({
        AI_INSIGHTS_ENABLED: "false",
        OPENAI_API_KEY: "test-key",
        OPENAI_MODEL: "test-model",
      }),
    ).toBe(false);
  });

  it("enables insights only when all required values are present", () => {
    expect(
      isAIInsightsEnabled({
        AI_INSIGHTS_ENABLED: "true",
        OPENAI_API_KEY: "test-key",
        OPENAI_MODEL: "test-model",
      }),
    ).toBe(true);
  });
});
