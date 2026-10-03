import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { NextResponse } from "next/server";
import { isAIInsightsEnabled } from "@/lib/ai-config";
import { getDemoSnapshot } from "@/lib/dashboard-metrics";
import { buildInsightPrompt } from "@/lib/insight-prompt";

export const runtime = "nodejs";

export async function POST() {
  const aiEnvironment = {
    AI_INSIGHTS_ENABLED: process.env.AI_INSIGHTS_ENABLED,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    OPENAI_MODEL: process.env.OPENAI_MODEL,
  };

  if (!isAIInsightsEnabled(aiEnvironment)) {
    return NextResponse.json(
      { error: "AI insights are disabled. Configure the server environment to enable them." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const snapshot = getDemoSnapshot();
    const { text } = await generateText({
      model: openai(process.env.OPENAI_MODEL!),
      system: "You explain synthetic observability metrics clearly and cautiously.",
      prompt: buildInsightPrompt(snapshot),
      maxOutputTokens: 180,
      abortSignal: AbortSignal.timeout(15_000),
    });

    const insight = text.trim().slice(0, 900);
    if (!insight) {
      return NextResponse.json(
        { error: "The AI provider returned an empty insight." },
        { status: 502, headers: { "Cache-Control": "no-store" } },
      );
    }

    return NextResponse.json({ insight }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    // Avoid logging provider errors: they may contain request details or configuration.
    return NextResponse.json(
      { error: "AI insights are temporarily unavailable. The simulated dashboard data is unchanged." },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
