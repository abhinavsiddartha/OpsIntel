"use client";

import React, { useState } from "react";
import { BarChart3, Filter, Download, ArrowUpRight, TrendingUp, PieChart, Layers } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("90d");
  const [metricType, setMetricType] = useState("revenue");

  const mockSeries = [
    { label: "NA-East Compute", share: 34, value: 490000, color: "#6366F1" },
    { label: "NA-West Platform", share: 28, value: 410000, color: "#3B82F6" },
    { label: "EMEA Cloud Subscriptions", share: 22, value: 315000, color: "#10B981" },
    { label: "APAC Emerging Edge", share: 16, value: 230000, color: "#F59E0B" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Operational Analytics & Drilldowns</h1>
          <p className="text-xs text-zinc-400">Multi-dimensional operational queries, cross-regional breakdowns, and financial segmentation</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => alert("Exporting dimensional analytics payload...")}
            className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/80 px-4 py-2 text-xs font-medium text-zinc-300 hover:border-zinc-700 hover:text-white"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Drilldown</span>
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-3 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          {["30d", "90d", "180d", "1y"].map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-medium uppercase transition-all ${
                timeRange === r ? "bg-indigo-600 text-white" : "border border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={metricType}
            onChange={(e) => setMetricType(e.target.value)}
            className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-300 focus:outline-none"
          >
            <option value="revenue">Gross Recognized Revenue</option>
            <option value="margin">Operating Gross Margin</option>
            <option value="units">Volume Shipped Units</option>
          </select>
        </div>
      </div>

      {/* Segment Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {mockSeries.map((s) => (
          <div key={s.label} className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-zinc-200">{s.label}</span>
              <span className="font-bold text-zinc-400">{s.share}%</span>
            </div>
            <p className="text-2xl font-bold font-mono text-white">{formatCurrency(s.value)}</p>
            <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
              <div style={{ width: `${s.share}%`, backgroundColor: s.color }} className="h-full rounded-full" />
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Matrix breakdown */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 space-y-4">
        <h2 className="text-base font-bold text-white">Segment Contribution Matrix</h2>
        <div className="divide-y divide-zinc-800/60 text-xs">
          <div className="grid grid-cols-5 py-3 font-semibold uppercase text-zinc-500 text-[10px]">
            <span>Domain Group</span>
            <span>Period Volume</span>
            <span>Share of Total</span>
            <span>YoY Momentum</span>
            <span className="text-right">Run-Rate</span>
          </div>
          {mockSeries.map((s) => (
            <div key={s.label} className="grid grid-cols-5 py-3.5 items-center font-medium hover:bg-zinc-800/30 transition-colors">
              <span className="font-semibold text-zinc-200">{s.label}</span>
              <span className="font-mono text-zinc-300">{formatCurrency(s.value)}</span>
              <span className="text-zinc-400">{s.share}%</span>
              <span className="text-emerald-400 font-semibold">+14.8%</span>
              <span className="text-right font-mono font-bold text-indigo-300">{formatCurrency(s.value * 4)}/yr</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
