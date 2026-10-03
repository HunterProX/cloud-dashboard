"use client";

import { useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  Blocks,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  Cpu,
  Gauge,
  LayoutDashboard,
  LoaderCircle,
  MemoryStick,
  MessageSquareText,
  MoreHorizontal,
  Network,
  Search,
  Server,
  Settings2,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardSnapshot } from "@/lib/dashboard-metrics";

type DashboardProps = { snapshot: DashboardSnapshot; aiEnabled: boolean };

const navItems = [
  { label: "Overview", icon: LayoutDashboard, active: true },
  { label: "Infrastructure", icon: Server, active: false },
  { label: "Network", icon: Network, active: false },
  { label: "Incidents", icon: Bell, active: false, count: "2" },
];

const metricIcons = { cpu: Cpu, memory: MemoryStick, requests: Activity, uptime: ShieldCheck };

function MetricCard({ metric, index }: { metric: DashboardSnapshot["metrics"][number]; index: number }) {
  const Icon = metricIcons[metric.icon];
  const isUtilizationMetric = metric.id === "cpu" || metric.id === "memory";
  const isPositive = isUtilizationMetric ? metric.change <= 0 : metric.change >= 0;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}>
      <Card className="metric-card group h-full transition-colors hover:border-white/[0.13]">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <span className="text-[13px] text-slate-400">{metric.label}</span>
            <span className="flex size-9 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.035] text-slate-300 transition-colors group-hover:text-cyan-200">
              <Icon size={17} strokeWidth={1.8} />
            </span>
          </div>
          <div className="mt-5 flex items-end justify-between gap-2">
            <div className="text-[28px] font-semibold tracking-[-0.045em] text-slate-50">
              {metric.id === "requests" ? metric.value.toLocaleString() : metric.value}
              <span className="ml-1 text-sm font-normal tracking-normal text-slate-500">{metric.unit}</span>
            </div>
            <span className={`mb-1 inline-flex items-center gap-0.5 text-xs ${isPositive ? "text-emerald-400" : "text-rose-400"}`}>
              {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {Math.abs(metric.change)}%
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500">
            <span className={`size-1.5 rounded-full ${metric.status === "watch" ? "bg-amber-400" : "bg-emerald-400"}`} />
            {metric.status === "watch" ? "Approaching threshold" : "Within expected range"}
            <span className="ml-auto">vs. previous hour</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ color: string; name: string; value: number }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-[#111922] px-3 py-2.5 shadow-xl">
      <p className="mb-2 text-xs text-slate-400">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 py-0.5 text-xs text-slate-200">
          <span className="size-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
          <span>{entry.name}</span><span className="ml-auto pl-5 font-medium">{entry.value}%</span>
        </div>
      ))}
    </div>
  );
}

export function Dashboard({ snapshot, aiEnabled }: DashboardProps) {
  const [cpuThreshold, setCpuThreshold] = useState(80);
  const [memoryThreshold, setMemoryThreshold] = useState(80);
  const [insight, setInsight] = useState<string | null>(null);
  const [insightError, setInsightError] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);

  async function requestInsight() {
    setLoadingInsight(true);
    setInsightError(null);
    try {
      const response = await fetch("/api/insights", { method: "POST" });
      const result: { insight?: string; error?: string } = await response.json();
      if (!response.ok || !result.insight) throw new Error(result.error ?? "Could not generate an insight.");
      setInsight(result.insight);
    } catch (error) {
      setInsightError(error instanceof Error ? error.message : "Could not generate an insight.");
    } finally {
      setLoadingInsight(false);
    }
  }

  const activeThresholdAlerts = snapshot.metrics.filter((metric) =>
    (metric.id === "cpu" && metric.value >= cpuThreshold) || (metric.id === "memory" && metric.value >= memoryThreshold),
  );

  return (
    <div className="app-shell min-h-screen text-slate-100">
      <aside className="sidebar fixed inset-y-0 left-0 z-20 hidden w-[248px] flex-col border-r border-white/[0.06] bg-[#0b1117] px-4 py-5 lg:flex">
        <a href="#main" className="flex items-center gap-3 px-2.5" aria-label="Northstar home">
          <span className="brand-mark flex size-9 items-center justify-center rounded-xl text-slate-950"><Blocks size={19} strokeWidth={2.2} /></span>
          <span><span className="block text-[15px] font-semibold tracking-tight">northstar</span><span className="block text-[10px] tracking-[0.16em] text-slate-500">OBSERVABILITY</span></span>
        </a>

        <div className="mt-9 px-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">Workspace</div>
        <button className="mt-2 flex h-10 items-center gap-2.5 rounded-lg border border-white/[0.07] bg-white/[0.025] px-2.5 text-left text-xs text-slate-300">
          <span className="flex size-6 items-center justify-center rounded-md bg-violet-400/15 text-[10px] font-semibold text-violet-300">A</span>
          Acme Studio <ChevronDown className="ml-auto text-slate-500" size={14} />
        </button>

        <div className="mt-8 px-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">Monitor</div>
        <nav className="mt-2 space-y-1" aria-label="Main navigation">
          {navItems.map(({ label, icon: Icon, active, count }) => (
            <a key={label} href="#main" aria-current={active ? "page" : undefined} className={`nav-link flex h-10 items-center gap-3 rounded-lg px-3 text-[13px] ${active ? "nav-link-active" : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"}`}>
              <Icon size={16} strokeWidth={1.8} />{label}{count && <span className="ml-auto rounded-md bg-white/[0.07] px-1.5 py-0.5 text-[10px] text-slate-300">{count}</span>}
            </a>
          ))}
        </nav>

        <div className="mt-8 px-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">Manage</div>
        <nav className="mt-2 space-y-1" aria-label="Management navigation">
          <a href="#thresholds" className="nav-link flex h-10 items-center gap-3 rounded-lg px-3 text-[13px] text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"><Settings2 size={16} strokeWidth={1.8} /> Alert rules</a>
          <a href="#services" className="nav-link flex h-10 items-center gap-3 rounded-lg px-3 text-[13px] text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"><Blocks size={16} strokeWidth={1.8} /> Services</a>
        </nav>

        <Card className="mt-auto overflow-hidden border-cyan-200/[0.12] bg-gradient-to-br from-cyan-300/[0.08] to-transparent">
          <CardContent className="p-3.5">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-200"><CircleHelp size={14} className="text-cyan-200" /> Demo environment</div>
            <p className="mt-2 text-[11px] leading-relaxed text-slate-500">Explore the dashboard with generated sample telemetry. No cloud account is connected.</p>
            <div className="mt-3 flex items-center gap-1.5 text-[10px] font-medium text-cyan-200"><span className="size-1.5 rounded-full bg-cyan-300" /> All systems simulated</div>
          </CardContent>
        </Card>
        <button className="mt-4 flex items-center gap-2.5 rounded-lg p-2 text-left hover:bg-white/[0.035]">
          <span className="flex size-8 items-center justify-center rounded-full bg-slate-700 text-[11px] font-semibold text-slate-200">JD</span>
          <span><span className="block text-xs text-slate-300">Jordan Davis</span><span className="block text-[10px] text-slate-600">Demo account</span></span>
          <MoreHorizontal size={16} className="ml-auto text-slate-600" />
        </button>
      </aside>

      <main id="main" className="min-h-screen lg:pl-[248px]">
        <header className="topbar sticky top-0 z-10 flex h-[66px] items-center justify-between border-b border-white/[0.06] bg-[#0d141b]/90 px-5 backdrop-blur-xl md:px-8">
          <div className="flex items-center gap-2 text-xs text-slate-500"><span>Workspace</span><span className="text-slate-700">/</span><span className="text-slate-200">Overview</span></div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden items-center gap-2 rounded-lg border border-white/[0.07] bg-white/[0.025] px-3 py-2 text-[11px] text-slate-600 md:flex"><Search size={13} />Search anything<span className="ml-4 rounded border border-white/[0.08] px-1.5 py-0.5 text-[9px]">⌘ K</span></div>
            <Button variant="ghost" size="icon" aria-label="Notifications" className="relative"><Bell size={17} /><span className="absolute right-2 top-2 size-1.5 rounded-full bg-cyan-300" /></Button>
            <span className="mx-1 hidden h-6 border-l border-white/[0.08] sm:block" />
            <span className="flex size-8 items-center justify-center rounded-full bg-violet-400/15 text-[11px] font-semibold text-violet-200">JD</span>
          </div>
        </header>

        <div className="mx-auto max-w-[1440px] px-5 pb-10 pt-7 md:px-8 md:pt-9">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-md border border-amber-300/15 bg-amber-300/[0.06] px-2 py-1 text-[9px] font-semibold tracking-[0.12em] text-amber-200/90"><span className="size-1.5 rounded-full bg-amber-300" />{snapshot.label}</div>
              <h1 className="text-[25px] font-semibold tracking-[-0.045em] text-white md:text-[30px]">Good morning, Jordan <span className="wave">✦</span></h1>
              <p className="mt-1.5 text-[13px] text-slate-500">Here&apos;s what&apos;s happening across your demo environment.</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="hidden sm:inline-flex"><Clock3 size={14} /> Last hour <ChevronDown size={13} className="text-slate-500" /></Button>
              <Button variant="outline"><span className="size-1.5 rounded-full bg-cyan-300" /> Demo mode</Button>
            </div>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {snapshot.metrics.map((metric, index) => <MetricCard key={metric.id} metric={metric} index={index} />)}
          </div>

          <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.7fr)_minmax(310px,0.85fr)]">
            <Card>
              <CardHeader className="flex-row items-start justify-between pb-0">
                <div><CardTitle className="text-[14px]">Resource utilization</CardTitle><p className="mt-1 text-[11px] text-slate-500">CPU and memory · generated sample series</p></div>
                <Button variant="ghost" size="icon" aria-label="Chart options"><MoreHorizontal size={17} /></Button>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="mb-3 flex items-center gap-4 text-[10px] text-slate-400"><span className="flex items-center gap-1.5"><i className="size-1.5 rounded-full bg-cyan-300" />CPU</span><span className="flex items-center gap-1.5"><i className="size-1.5 rounded-full bg-violet-300" />Memory</span><span className="ml-auto text-slate-600">Last 2 hours</span></div>
                <div className="h-[230px] w-full" aria-label="Simulated CPU and memory chart">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={snapshot.series} margin={{ top: 8, right: 5, left: -22, bottom: 0 }}>
                      <defs>
                        <linearGradient id="cpuFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#67e8f9" stopOpacity={0.18} /><stop offset="95%" stopColor="#67e8f9" stopOpacity={0} /></linearGradient>
                        <linearGradient id="memoryFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#c4b5fd" stopOpacity={0.12} /><stop offset="95%" stopColor="#c4b5fd" stopOpacity={0} /></linearGradient>
                      </defs>
                      <CartesianGrid vertical={false} stroke="rgba(148,163,184,.1)" strokeDasharray="3 5" />
                      <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 10 }} tickMargin={11} interval={2} />
                      <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 10 }} tickFormatter={(value: number) => `${value}%`} />
                      <Tooltip content={<ChartTooltip />} />
                      <Area type="monotone" dataKey="cpu" name="CPU" stroke="#67e8f9" strokeWidth={2} fill="url(#cpuFill)" activeDot={{ r: 4, strokeWidth: 0 }} />
                      <Area type="monotone" dataKey="memory" name="Memory" stroke="#c4b5fd" strokeWidth={2} fill="url(#memoryFill)" activeDot={{ r: 4, strokeWidth: 0 }} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-1 flex items-center gap-2 border-t border-white/[0.055] pt-3 text-[10px] text-slate-500"><Activity size={13} className="text-cyan-300" />Stable sample trend <span className="ml-auto">Updates are not live</span></div>
              </CardContent>
            </Card>

            <Card id="services">
              <CardHeader className="flex-row items-center justify-between pb-2"><div><CardTitle className="text-[14px]">Service health</CardTitle><p className="mt-1 text-[11px] text-slate-500">Sample service status</p></div><span className="flex items-center gap-1.5 text-[10px] text-emerald-300"><span className="size-1.5 rounded-full bg-emerald-300" />All operational</span></CardHeader>
              <CardContent>
                <div className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-300/[0.12] bg-emerald-300/[0.035] p-3"><div className="flex size-8 items-center justify-center rounded-lg bg-emerald-300/[0.1] text-emerald-300"><Check size={16} /></div><div><p className="text-xs font-medium text-slate-200">3 services operational</p><p className="mt-0.5 text-[10px] text-slate-500">Based on static demo state</p></div><span className="ml-auto text-[10px] text-emerald-300">100%</span></div>
                <div className="space-y-1">
                  {[{ name: "web-frontend", region: "us-east-1 · Demo", latency: "42 ms" }, { name: "api-gateway", region: "eu-west-1 · Demo", latency: "68 ms" }, { name: "worker-queue", region: "us-west-2 · Demo", latency: "31 ms" }].map((service, i) => (
                    <div key={service.name} className="flex items-center gap-3 rounded-lg px-2 py-3 hover:bg-white/[0.025]"><span className={`flex size-8 items-center justify-center rounded-lg ${i === 1 ? "bg-violet-300/[0.09] text-violet-200" : "bg-cyan-300/[0.08] text-cyan-200"}`}><Server size={15} /></span><div className="min-w-0"><p className="text-xs text-slate-300">{service.name}</p><p className="mt-0.5 text-[10px] text-slate-600">{service.region}</p></div><div className="ml-auto text-right"><p className="text-[11px] text-slate-300">{service.latency}</p><p className="mt-0.5 text-[9px] text-slate-600">latency</p></div><span className="ml-1 size-1.5 rounded-full bg-emerald-300" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(310px,0.8fr)]">
            <Card id="thresholds">
              <CardHeader className="flex-row items-start justify-between pb-3"><div><CardTitle className="text-[14px]">Alert thresholds</CardTitle><p className="mt-1 text-[11px] text-slate-500">Adjust local demo thresholds</p></div><span className="flex size-8 items-center justify-center rounded-lg bg-amber-300/[0.08] text-amber-200"><Gauge size={16} /></span></CardHeader>
              <CardContent className="space-y-5">
                {([{ label: "CPU utilization", value: cpuThreshold, set: setCpuThreshold }, { label: "Memory usage", value: memoryThreshold, set: setMemoryThreshold }] as const).map(({ label, value, set }) => (
                  <label key={label} className="block"><span className="flex items-center justify-between text-xs text-slate-300"><span>{label}</span><span className="font-mono text-[11px] text-slate-400">{value}%</span></span><input aria-label={`${label} threshold`} type="range" min="50" max="95" step="5" value={value} onChange={(event) => set(Number(event.target.value))} className="threshold-slider mt-3 w-full" /><span className="mt-1 flex justify-between text-[9px] text-slate-600"><span>50%</span><span>95%</span></span></label>
                ))}
                <div aria-live="polite" className={`rounded-lg border p-3 text-[11px] ${activeThresholdAlerts.length ? "border-amber-300/15 bg-amber-300/[0.04] text-amber-200" : "border-white/[0.06] bg-white/[0.02] text-slate-400"}`}>
                  {activeThresholdAlerts.length ? `Demo alert: ${activeThresholdAlerts.map((metric) => metric.label).join(", ")} is above the selected threshold.` : "No simulated metrics are above the selected thresholds."}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex-row items-start justify-between pb-3"><div><CardTitle className="flex items-center gap-2 text-[14px]"><Sparkles size={15} className="text-cyan-200" /> AI trend summary</CardTitle><p className="mt-1 text-[11px] text-slate-500">Generated from synthetic metrics only</p></div><span className="rounded-md border border-cyan-200/10 bg-cyan-200/[0.04] px-1.5 py-1 text-[9px] text-cyan-100/80">PREVIEW</span></CardHeader>
              <CardContent>
                <div className="min-h-[98px] rounded-xl border border-white/[0.055] bg-[#0d141b] p-3.5">
                  <div className="mb-2 flex items-center gap-1.5 text-[9px] uppercase tracking-[0.12em] text-slate-600"><span className="size-1 rounded-full bg-cyan-300" />Sample data context</div>
                  {insight ? <p className="text-[11px] leading-relaxed text-slate-300">{insight}</p> : <p className="text-[11px] leading-relaxed text-slate-500">{aiEnabled ? "Ask AI to explain the sample trend. The model only receives the synthetic values shown on this page." : "AI insights are optional and currently disabled. The dashboard works without an API key."}</p>}
                  {insightError && <p role="alert" className="mt-2 text-[10px] text-rose-300">{insightError}</p>}
                </div>
                <Button onClick={requestInsight} disabled={!aiEnabled || loadingInsight} className="mt-3 w-full">
                  {loadingInsight ? <LoaderCircle size={14} className="animate-spin" /> : <MessageSquareText size={14} />}
                  {loadingInsight ? "Generating summary…" : aiEnabled ? "Generate AI summary" : "AI summary unavailable"}
                </Button>
                <p className="mt-2 text-center text-[9px] text-slate-600">Does not use cloud credentials, user data, or live telemetry.</p>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-5">
            <CardHeader className="flex-row items-center justify-between pb-2"><div><CardTitle className="text-[14px]">Recent activity</CardTitle><p className="mt-1 text-[11px] text-slate-500">Illustrative events generated for this demo</p></div><Button variant="ghost" size="sm">View all <ArrowUpRight size={13} /></Button></CardHeader>
            <CardContent>
              <div className="divide-y divide-white/[0.05]">
                {snapshot.alerts.map((alert) => (
                  <div key={alert.id} className="flex items-center gap-3 py-3 first:pt-1 last:pb-1"><span className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${alert.severity === "warning" ? "bg-amber-300/[0.08] text-amber-200" : "bg-cyan-300/[0.08] text-cyan-200"}`}>{alert.severity === "warning" ? <Zap size={15} /> : <Check size={15} />}</span><div className="min-w-0"><p className="text-xs text-slate-300">{alert.title}</p><p className="mt-1 truncate text-[10px] text-slate-600">{alert.detail}</p></div><span className="ml-auto flex shrink-0 items-center gap-1.5 text-[10px] text-slate-600"><Clock3 size={11} />{alert.time}</span></div>
                ))}
              </div>
            </CardContent>
          </Card>

          <footer className="mt-7 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-600"><span>Northstar prototype <span className="mx-1.5 text-slate-700">·</span> All telemetry is deterministic sample data</span><span>Last sample timestamp: {new Date(snapshot.generatedAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" })} UTC</span></footer>
        </div>
      </main>
    </div>
  );
}
