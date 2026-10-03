import { Dashboard } from "@/components/dashboard";
import { getDemoSnapshot } from "@/lib/dashboard-metrics";

export default function Home() {
  return <Dashboard snapshot={getDemoSnapshot()} aiEnabled={process.env.AI_INSIGHTS_ENABLED === "true" && Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_MODEL)} />;
}
