export type AIEnvironment = {
  AI_INSIGHTS_ENABLED?: string;
  OPENAI_API_KEY?: string;
  OPENAI_MODEL?: string;
};

export function isAIInsightsEnabled(env: AIEnvironment): boolean {
  return env.AI_INSIGHTS_ENABLED === "true" && Boolean(env.OPENAI_API_KEY?.trim()) && Boolean(env.OPENAI_MODEL?.trim());
}
