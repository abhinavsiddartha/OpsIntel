"use client";

import React, { useEffect, useState } from "react";
import { Target, Plus, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { api } from "@/lib/api";
import { TargetItem } from "@/types";
import { formatCurrency } from "@/lib/utils";

export default function TargetsPage() {
  const [targets, setTargets] = useState<TargetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [period, setPeriod] = useState("2026-Q2");
  const [entityType, setEntityType] = useState("company");
  const [targetValue, setTargetValue] = useState("1000000");

  const loadTargets = async () => {
    try {
      const res = await api.getTargets();
      if (res?.data) setTargets(res.data);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTargets();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createTarget({
        title,
        period,
        entity_type: entityType,
        target_value: parseFloat(targetValue),
      });
      setShowModal(false);
      loadTargets();
    } catch {
      setShowModal(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Target & Quota Governance</h1>
          <p className="text-xs text-zinc-400">Quarterly corporate, regional, and product revenue targets with predictive achievement scoring</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-500"
        >
          <Plus className="h-4 w-4" />
          <span>New Target Threshold</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full py-12 text-center text-zinc-500">Loading target telemetry...</div>
        ) : (
          targets.map((t) => (
            <div
              key={t.id}
              className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 backdrop-blur-sm space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="rounded bg-zinc-800 px-2 py-0.5 text-[10px] font-mono text-zinc-400">
                    {t.period}
                  </span>
                  <h3 className="text-base font-bold text-white mt-1">{t.title}</h3>
                  <span className="text-xs text-zinc-500 capitalize">{t.entity_type} Level</span>
                </div>
                <StatusBadge status={t.risk_level} />
              </div>

              <div className="space-y-3 border-t border-zinc-800/60 pt-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Goal Target:</span>
                  <span className="font-mono font-bold text-zinc-100">{formatCurrency(t.target_value)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Current Progress:</span>
                  <span className="font-mono font-bold text-emerald-400">{formatCurrency(t.actual_value)}</span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-zinc-400">Pacing Achievement</span>
                    <span className="font-bold text-white">{t.achievement_rate}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
                    <div
                      style={{ width: `${Math.min(t.achievement_rate, 100)}%` }}
                      className={`h-full rounded-full ${
                        t.achievement_rate >= 100 ? "bg-emerald-500" : "bg-indigo-500"
                      }`}
                    />
                  </div>
                </div>

                <div className="flex justify-between text-[11px] text-zinc-400 border-t border-zinc-800/40 pt-2">
                  <span>ML Projected Final:</span>
                  <span className="font-bold text-indigo-300">{t.predicted_achievement}%</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Target Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-bold text-white">Define Target Milestone</h3>
              <button onClick={() => setShowModal(false)} className="text-zinc-500 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-zinc-300 font-medium">Target Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q2 2026 Enterprise SaaS Expansion"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-zinc-300 font-medium">Period</label>
                  <input
                    type="text"
                    required
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-zinc-300 font-medium">Scope</label>
                  <select
                    value={entityType}
                    onChange={(e) => setEntityType(e.target.value)}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-100 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="company">Company</option>
                    <option value="region">Region</option>
                    <option value="category">Category</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-300 font-medium">Target Revenue Value ($)</label>
                <input
                  type="number"
                  required
                  value={targetValue}
                  onChange={(e) => setTargetValue(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-zinc-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-indigo-600 py-2.5 font-semibold text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/30"
              >
                Create Target
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
