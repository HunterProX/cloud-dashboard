import { z } from "zod";

const metricSchema = z.object({
  id: z.string(),
  label: z.string(),
  value: z.number().nonnegative(),
  unit: z.string(),
  change: z.number(),
  icon: z.enum(["cpu", "memory", "requests", "uptime"]),
  status: z.enum(["healthy", "watch", "critical"]),
}).superRefine((metric, context) => {
  if (metric.unit === "%" && metric.value > 100) {
    context.addIssue({ code: "custom", message: "Percentage values cannot exceed 100.", path: ["value"] });
  }
});

const pointSchema = z.object({
  time: z.string(),
  cpu: z.number().min(0).max(100),
  memory: z.number().min(0).max(100),
  requests: z.number().nonnegative(),
});

export const dashboardSnapshotSchema = z.object({
  demoMode: z.literal(true),
  label: z.literal("SIMULATED DATA"),
  generatedAt: z.string(),
  metrics: z.array(metricSchema).length(4),
  series: z.array(pointSchema).length(12),
  alerts: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      detail: z.string(),
      severity: z.enum(["info", "warning", "critical"]),
      time: z.string(),
    }),
  ),
});

export type DashboardSnapshot = z.infer<typeof dashboardSnapshotSchema>;

const series = [
  { time: "09:00", cpu: 35, memory: 52, requests: 390 },
  { time: "09:10", cpu: 39, memory: 53, requests: 430 },
  { time: "09:20", cpu: 34, memory: 54, requests: 405 },
  { time: "09:30", cpu: 47, memory: 55, requests: 510 },
  { time: "09:40", cpu: 43, memory: 57, requests: 488 },
  { time: "09:50", cpu: 56, memory: 58, requests: 620 },
  { time: "10:00", cpu: 51, memory: 60, requests: 590 },
  { time: "10:10", cpu: 46, memory: 61, requests: 550 },
  { time: "10:20", cpu: 61, memory: 61, requests: 710 },
  { time: "10:30", cpu: 57, memory: 63, requests: 680 },
  { time: "10:40", cpu: 49, memory: 64, requests: 610 },
  { time: "10:50", cpu: 54, memory: 65, requests: 645 },
];

export function getDemoSnapshot(): DashboardSnapshot {
  return dashboardSnapshotSchema.parse({
    demoMode: true,
    label: "SIMULATED DATA",
    generatedAt: "2026-10-02T10:50:00.000Z",
    metrics: [
      { id: "cpu", label: "CPU utilization", value: 54, unit: "%", change: 8.2, icon: "cpu", status: "healthy" },
      { id: "memory", label: "Memory usage", value: 65, unit: "%", change: 3.1, icon: "memory", status: "watch" },
      { id: "requests", label: "Request volume", value: 645, unit: "/min", change: 12.4, icon: "requests", status: "healthy" },
      { id: "uptime", label: "Service availability", value: 99.94, unit: "%", change: 0.02, icon: "uptime", status: "healthy" },
    ],
    series,
    alerts: [
      { id: "memory-watch", title: "Memory trending upward", detail: "Simulated memory crossed the 60% watch threshold.", severity: "warning", time: "4 min ago" },
      { id: "deploy-info", title: "Deployment completed", detail: "Demo service web-01 · build v2.8.4", severity: "info", time: "18 min ago" },
    ],
  });
}
