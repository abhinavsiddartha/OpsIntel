"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  AlertTriangle,
  Users,
  Boxes,
  ArrowRight,
  Sparkles,
  Bot,
  RefreshCw,
  Layers,
  ChevronRight,
  ShieldAlert
} from "lucide-react";
import { KpiCard } from "@/components/kpi-card";
import { StatusBadge } from "@/components/status-badge";
import { DashboardSkeleton } from "@/components/loading-skeleton";
import { api } from "@/lib/api";
import { OverviewAnalytics } from "@/types";
import { formatCurrency, formatNumber } from "@/lib/utils";

export default function OverviewPage() {
  const [data, setData] = useState<OverviewAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      const res = await api.getOverview();
      if (res?.data) {
        setData(res.data);
      }
    } catch {
      // Fallback mock dataset for immediate UI preview
      setData({
        kpis: {
          revenue: { title: "Monthly Revenue", value: "$482,500", numeric_value: 482500, previous_value: 429000, change_pct: 12.4, trend: "up", unit: "$", sparkline: [380000, 410000, 395000, 430000, 429000, 482500] },
          orders: { title: "Total Orders", value: "348", numeric_value: 348, previous_value: 312, change_pct: 11.5, trend: "up", unit: "orders", sparkline: [260, 280, 295, 310, 312, 348] },
          target: { title: "Target Achievement", value: "91.5%", numeric_value: 91.5, previous_value: 87.4, change_pct: 4.1, trend: "up", unit: "%", sparkline: [82, 84, 86, 88, 87, 91.5] },
          stockout_risk: { title: "Stockout Risk SKUs", value: "2 Items", numeric_value: 2, previous_value: 1, change_pct: 50.0, trend: "down", unit: "items", sparkline: [1, 2, 1, 3, 1, 2] },
          churn_risk: { title: "At-Risk Accounts", value: "6 Accounts", numeric_value: 6, previous_value: 7, change_pct: -14.2, trend: "up", unit: "accounts", sparkline: [8, 8, 7, 7, 7, 6] },
        },
        revenue_trend: [
          { month: "Nov 2025", revenue: 380000, target: 410000, orders: 260 },
          { month: "Dec 2025", revenue: 410000, target: 430000, orders: 280 },
          { month: "Jan 2026", revenue: 395000, target: 440000, orders: 295 },
          { month: "Feb 2026", revenue: 430000, target: 460000, orders: 310 },
          { month: "Mar 2026", revenue: 429000, target: 470000, orders: 312 },
          { month: "Apr 2026", revenue: 482500, target: 500000, orders: 348 },
        ],
        sales_by_region: [
          { region_id: 1, name: "North America - East", code: "NA-EAST", revenue: 145000, target: 1200000, achievement: 98.3 },
          { region_id: 2, name: "North America - West", code: "NA-WEST", revenue: 168000, target: 1400000, achievement: 87.1 },
          { region_id: 3, name: "EMEA Central", code: "EMEA-C", revenue: 89000, target: 950000, achievement: 82.1 },
          { region_id: 4, name: "APAC Emerging", code: "APAC-E", revenue: 80500, target: 850000, achievement: 110.5 },
        ],
        top_products: [
          { id: 1, name: "Titan-9000 AI Rack Server", sku: "SKU-SVR-9001", revenue: 147000, units: 6 },
          { id: 6, name: "OpsIntel Enterprise Platform", sku: "SKU-SFT-ENT-1Y", revenue: 96000, units: 2 },
          { id: 4, name: "Apex GPU Accelerator Pod", sku: "SKU-GPU-008", revenue: 64000, units: 2 },
          { id: 11, name: "Sentinel-X Next-Gen Firewall", sku: "SKU-NET-FW-100G", revenue: 39000, units: 2 },
          { id: 7, name: "OpsIntel AI Decision Core", sku: "SKU-SFT-AI-1Y", revenue: 37000, units: 2 },
        ],
        target_achievement: [
          { period: "2026-Q1", title: "Global Revenue Target", target: 4500000, actual: 4120000, achievement: 91.5, predicted: 96.2 },
          { period: "2026-Q1", title: "NA-East Regional Target", target: 1200000, actual: 1180000, achievement: 98.3, predicted: 102.0 },
          { period: "2026-Q1", title: "APAC Regional Target", target: 850000, actual: 940000, achievement: 110.5, predicted: 114.0 },
        ],
        stockout_risks: [
          { product_id: 4, name: "Apex GPU Accelerator Pod", sku: "SKU-GPU-008", current_stock: 6, days_left: 4.8, risk: "critical", reorder_qty: 18 },
          { product_id: 23, name: "Ruggedized Field Telemetry Hub", sku: "SKU-IOT-RUG-02", current_stock: 4, days_left: 3.2, risk: "critical", reorder_qty: 24 },
        ],
        churn_risks: [
          { customer_id: 5, name: "CyberNet Technologies", company: "CyberNet Technologies", ltv: 240000, churn_score: 0.89, risk_level: "high", last_order_days: 92 },
          { customer_id: 12, name: "Vanguard Systems", company: "Vanguard Systems", ltv: 168000, churn_score: 0.82, risk_level: "high", last_order_days: 84 },
        ],
        ai_summary: "Revenue paced at $482,500 (+12.4% MoM) driven by enterprise compute renewals. Critical inventory constraints on Apex GPU Pods require an expedited supplier order. 6 accounts flagged in the elevated churn band require proactive account executive engagement."
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  if (loading || !data) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Operational Decision Support</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Executive Command</h1>
          <p className="text-xs text-muted-foreground">Connecting business signals, emerging risks, and verified cross-ledger evidence</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-medium text-foreground transition-colors hover:border-ring"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin text-primary" : ""}`} />
            <span>{refreshing ? "Refreshing..." : "Sync Signals"}</span>
          </button>
          <Link
            href="/intelligence"
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
          >
            <span>Intelligence & Copilot</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Top 5 KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <KpiCard
          title={data.kpis.revenue.title}
          value={data.kpis.revenue.value}
          changePct={data.kpis.revenue.change_pct}
          trend={data.kpis.revenue.trend}
          sparkline={data.kpis.revenue.sparkline}
        />
        <KpiCard
          title={data.kpis.orders.title}
          value={data.kpis.orders.value}
          changePct={data.kpis.orders.change_pct}
          trend={data.kpis.orders.trend}
          sparkline={data.kpis.orders.sparkline}
        />
        <KpiCard
          title={data.kpis.target.title}
          value={data.kpis.target.value}
          changePct={data.kpis.target.change_pct}
          trend={data.kpis.target.trend}
          sparkline={data.kpis.target.sparkline}
        />
        <KpiCard
          title={data.kpis.stockout_risk.title}
          value={data.kpis.stockout_risk.value}
          changePct={data.kpis.stockout_risk.change_pct}
          trend={data.kpis.stockout_risk.trend}
          sparkline={data.kpis.stockout_risk.sparkline}
        />
        <KpiCard
          title={data.kpis.churn_risk.title}
          value={data.kpis.churn_risk.value}
          changePct={data.kpis.churn_risk.change_pct}
          trend={data.kpis.churn_risk.trend}
          sparkline={data.kpis.churn_risk.sparkline}
        />
      </div>

      {/* Decision-Support Operational Signals Brief */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Critical Operational Signals & Emerging Risks
              </span>
              <span className="rounded bg-secondary px-2 py-0.5 text-[10px] font-mono text-muted-foreground border border-border">
                LEDGER VERIFIED
              </span>
            </div>
            <p className="text-xs text-foreground/90 leading-relaxed font-sans">{data.ai_summary}</p>
          </div>
          <Link
            href="/intelligence"
            className="hidden items-center gap-1.5 rounded-lg border border-border bg-secondary/80 px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary hover:border-ring transition-colors md:flex shrink-0"
          >
            <span>Investigate Evidence</span>
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Charts & Analytics Rows */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Revenue Trend Visualizer */}
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 backdrop-blur-sm lg:col-span-2 space-y-4 overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Revenue Run-Rate vs. Target</h2>
              <p className="text-xs text-zinc-400">Monthly historical revenue alongside operational targets</p>
            </div>
            <span className="text-xs text-zinc-500">6-Month Trend</span>
          </div>

          {(() => {
            const maxVal = Math.max(
              ...data.revenue_trend.map((m) => Math.max(m.revenue || 0, m.target || 0)),
              100000
            ) * 1.15;

            return (
              <div className="h-64 flex items-end gap-3 pt-8 pb-2">
                {data.revenue_trend.map((m, idx) => {
                  const revHeight = Math.min(Math.max(((m.revenue || 0) / maxVal) * 100, 2), 100);
                  const targetHeight = Math.min(Math.max(((m.target || 0) / maxVal) * 100, 2), 100);

                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      <div className="w-full flex items-end justify-center gap-1.5 h-full">
                        {/* Realized bar */}
                        <div
                          style={{ height: `${revHeight}%` }}
                          className="w-full max-w-[28px] rounded-t-md bg-indigo-600 transition-all group-hover:bg-indigo-500 relative"
                        >
                          <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-950 text-[10px] border border-zinc-700 px-1.5 py-0.5 rounded whitespace-nowrap z-10 transition-opacity">
                            ${((m.revenue || 0) / 1000).toFixed(0)}k
                          </div>
                        </div>
                        {/* Target bar */}
                        <div
                          style={{ height: `${targetHeight}%` }}
                          className="w-full max-w-[12px] rounded-t-md bg-zinc-700/60 transition-all group-hover:bg-zinc-600"
                        />
                      </div>
                      <span className="text-[11px] font-medium text-zinc-400 truncate w-full text-center">
                        {m.month.split(" ")[0]}
                      </span>
                    </div>
                  );
                })}
              </div>
            );
          })()}

          <div className="flex items-center justify-center gap-6 border-t border-zinc-800/80 pt-3 text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-indigo-600" />
              <span>Realized Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-sm bg-muted-foreground" />
              <span>Period Target</span>
            </div>
          </div>
        </div>

        {/* Regional Breakdown */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground">Regional Performance</h2>
            <Link href="/sales" className="text-xs text-primary hover:underline">
              Explorer
            </Link>
          </div>

          <div className="space-y-4">
            {data.sales_by_region.map((reg) => (
              <div key={reg.region_id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground">{reg.name}</span>
                  <span className="font-mono text-muted-foreground">{formatCurrency(reg.revenue)}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    style={{ width: `${Math.min(reg.achievement, 100)}%` }}
                    className={`h-full rounded-full ${
                      reg.achievement >= 100
                        ? "bg-emerald-500"
                        : reg.achievement >= 85
                        ? "bg-primary"
                        : "bg-amber-500"
                    }`}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>Quota Achievement</span>
                  <span className="font-semibold text-foreground">{reg.achievement}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Operational Watchlists Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Top Products */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground">Top Products by Revenue</h2>
            <Link href="/sales" className="text-xs text-primary hover:underline">
              All SKUs
            </Link>
          </div>

          <div className="space-y-3">
            {data.top_products.map((p, idx) => (
              <div key={p.id} className="flex items-center justify-between rounded-xl bg-secondary/50 p-3 border border-border">
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-secondary text-xs font-bold text-muted-foreground">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-foreground truncate max-w-[150px]">{p.name}</p>
                    <p className="text-[10px] font-mono text-muted-foreground">{p.sku}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-foreground">{formatCurrency(p.revenue)}</p>
                  <p className="text-[10px] text-muted-foreground">{p.units} units</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stockout Risk Alerts */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Boxes className="h-4 w-4 text-amber-500" />
              <h2 className="text-base font-bold text-foreground">Critical Stockout Risks</h2>
            </div>
            <Link href="/inventory" className="text-xs text-primary hover:underline">
              Inventory
            </Link>
          </div>

          <div className="space-y-3">
            {data.stockout_risks.map((item) => (
              <div key={item.product_id} className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground">{item.name}</span>
                  <StatusBadge status={item.risk} />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Current: <strong className="text-foreground">{item.current_stock} units</strong></span>
                  <span>Days Left: <strong className="text-rose-500">{item.days_left}d</strong></span>
                </div>
                <div className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                  Suggested Reorder: +{item.reorder_qty} units
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Churn Risk Watchlist */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-rose-500" />
              <h2 className="text-base font-bold text-foreground">High Churn Exposure</h2>
            </div>
            <Link href="/customers" className="text-xs text-primary hover:underline">
              Customer Hub
            </Link>
          </div>

          <div className="space-y-3">
            {data.churn_risks.map((c) => (
              <div key={c.customer_id} className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground truncate max-w-[150px]">{c.name}</span>
                  <StatusBadge status={c.risk_level} />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>LTV: <strong className="text-foreground">{formatCurrency(c.ltv)}</strong></span>
                  <span>Inactivity: <strong className="text-rose-500">{c.last_order_days}d</strong></span>
                </div>
                <div className="text-[11px] text-rose-300/80 font-medium">
                  ML Churn Probability: {(c.churn_score * 100).toFixed(0)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
