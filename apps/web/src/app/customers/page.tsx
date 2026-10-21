"use client";

import React, { useEffect, useState } from "react";
import { Search, Users, ShieldAlert, ArrowUpRight, X, Clock } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { api } from "@/lib/api";
import { Customer } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [segment, setSegment] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedCust, setSelectedCust] = useState<Customer | null>(null);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: "1",
        page_size: "30",
        ...(segment ? { segment } : {}),
        ...(search ? { search } : {}),
      });
      const res = await api.getCustomers(params.toString());
      if (res?.data) {
        setCustomers(res.data);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, [segment]);

  const openCustomerDetail = async (c: Customer) => {
    try {
      const res = await api.getCustomerDetail(c.id);
      if (res?.data) {
        setSelectedCust(res.data);
      } else {
        setSelectedCust(c);
      }
    } catch {
      setSelectedCust(c);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Customer Intelligence & Retention</h1>
          <p className="text-xs text-zinc-400">RFM segmentation personas, predictive churn scoring, and client transaction timelines</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search customer name, domain, code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && loadCustomers()}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-9 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <select
          value={segment}
          onChange={(e) => setSegment(e.target.value)}
          className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-300 focus:border-indigo-500 focus:outline-none"
        >
          <option value="">All RFM Segments</option>
          <option value="High Value Champions">High Value Champions</option>
          <option value="Growth Potential">Growth Potential</option>
          <option value="Loyal Regulars">Loyal Regulars</option>
          <option value="At Risk">At Risk</option>
          <option value="Low Engagement">Low Engagement</option>
        </select>
      </div>

      {/* Grid of Customer Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full py-12 text-center text-zinc-500">Loading customer telemetry...</div>
        ) : (
          customers.map((c) => {
            const isHighRisk = c.churn_risk_level === "high" || c.churn_risk_level === "critical";
            return (
              <div
                key={c.id}
                onClick={() => openCustomerDetail(c)}
                className={`cursor-pointer rounded-2xl border p-5 backdrop-blur-sm transition-all hover:scale-[1.01] ${
                  isHighRisk
                    ? "border-rose-900/50 bg-rose-950/15 hover:border-rose-700/70"
                    : "border-zinc-800/80 bg-zinc-900/60 hover:border-zinc-700"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-[10px] text-zinc-500">{c.customer_code}</span>
                    <h3 className="text-base font-bold text-white truncate max-w-[200px]">{c.name}</h3>
                    <p className="text-xs text-zinc-400">{c.email}</p>
                  </div>
                  <StatusBadge status={c.churn_risk_level} />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 border-t border-zinc-800/60 pt-3 text-xs">
                  <div>
                    <span className="text-zinc-500">Lifetime Value:</span>
                    <p className="font-mono font-bold text-zinc-100">{formatCurrency(c.lifetime_value)}</p>
                  </div>
                  <div>
                    <span className="text-zinc-500">Total Orders:</span>
                    <p className="font-mono font-bold text-zinc-100">{c.total_orders}</p>
                  </div>
                  <div>
                    <span className="text-zinc-500">Segment:</span>
                    <p className="font-semibold text-indigo-400">{c.segment_name}</p>
                  </div>
                  <div>
                    <span className="text-zinc-500">Churn Prob:</span>
                    <p className={`font-mono font-bold ${isHighRisk ? "text-rose-400" : "text-emerald-400"}`}>
                      {(c.churn_risk_score * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Customer Timeline Drawer */}
      {selectedCust && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md border-l border-zinc-800 bg-zinc-950 p-6 shadow-2xl animate-in slide-in-from-right duration-200 overflow-y-auto">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div>
              <span className="font-mono text-xs text-zinc-500">{selectedCust.customer_code}</span>
              <h2 className="text-lg font-bold text-white">{selectedCust.name}</h2>
            </div>
            <button
              onClick={() => setSelectedCust(null)}
              className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-5 space-y-5 text-xs">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-zinc-400">Account Territory:</span>
                <span className="font-semibold text-zinc-200">{selectedCust.region_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Avg Order Size:</span>
                <span className="font-mono font-bold text-zinc-200">{formatCurrency(selectedCust.avg_order_value)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Churn Risk Level:</span>
                <StatusBadge status={selectedCust.churn_risk_level} />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-indigo-400" />
                <h3 className="font-semibold uppercase tracking-wider text-zinc-300">Activity Timeline</h3>
              </div>

              <div className="space-y-2 border-l-2 border-zinc-800 pl-4">
                {selectedCust.timeline && selectedCust.timeline.length > 0 ? (
                  selectedCust.timeline.map((ev, i) => (
                    <div key={i} className="relative space-y-1 pb-4">
                      <div className="flex justify-between text-[11px]">
                        <span className="font-bold text-zinc-200">{ev.description}</span>
                        <span className="text-zinc-500">{formatDate(ev.date)}</span>
                      </div>
                      {ev.amount && (
                        <p className="font-mono font-semibold text-emerald-400">{formatCurrency(ev.amount)}</p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-zinc-500">No historical events recorded for this account.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
