"use client";

import React, { useEffect, useState } from "react";
import { Boxes, AlertTriangle, ArrowDownRight, ArrowUpRight, RefreshCw, Plus, ShieldCheck, Download } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { api } from "@/lib/api";
import { InventoryItem } from "@/types";
import { formatCurrency } from "@/lib/utils";

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRisk, setFilterRisk] = useState("");

  const loadInventory = async () => {
    setLoading(true);
    try {
      const res = await api.getInventory(filterRisk);
      if (res?.data) {
        setItems(res.data);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, [filterRisk]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
            <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Operational Risk Defense</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Supply Chain & Inventory</h1>
          <p className="text-xs text-muted-foreground">Preventing stockouts, excess carrying costs, and supplier lead-time bottlenecks</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => alert("Generating Economic Order Quantity (EOQ) replenishment POs...")}
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Generate Reorder POs</span>
          </button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilterRisk("")}
          className={`rounded-xl px-3.5 py-1.5 text-xs font-medium transition-all ${
            filterRisk === "" ? "bg-primary text-primary-foreground font-semibold shadow-sm" : "border border-border bg-card text-muted-foreground hover:border-ring hover:text-foreground"
          }`}
        >
          All SKUs
        </button>
        <button
          onClick={() => setFilterRisk("critical")}
          className={`rounded-xl px-3.5 py-1.5 text-xs font-medium transition-all ${
            filterRisk === "critical" ? "bg-rose-600 text-white font-semibold shadow-sm" : "border border-border bg-card text-muted-foreground hover:border-ring hover:text-foreground"
          }`}
        >
          Critical Shortages
        </button>
        <button
          onClick={() => setFilterRisk("high")}
          className={`rounded-xl px-3.5 py-1.5 text-xs font-medium transition-all ${
            filterRisk === "high" ? "bg-amber-600 text-white font-semibold shadow-sm" : "border border-border bg-card text-muted-foreground hover:border-ring hover:text-foreground"
          }`}
        >
          Elevated Risk
        </button>
        <button
          onClick={() => setFilterRisk("low")}
          className={`rounded-xl px-3.5 py-1.5 text-xs font-medium transition-all ${
            filterRisk === "low" ? "bg-emerald-600 text-white font-semibold shadow-sm" : "border border-border bg-card text-muted-foreground hover:border-ring hover:text-foreground"
          }`}
        >
          Healthy Buffer
        </button>
      </div>

      {/* Inventory Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-secondary/30 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3.5">SKU</th>
                <th className="px-5 py-3.5">Product Specification</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Stock Level</th>
                <th className="px-5 py-3.5">Daily Velocity</th>
                <th className="px-5 py-3.5">Days to Stockout</th>
                <th className="px-5 py-3.5">Risk Assessment</th>
                <th className="px-5 py-3.5">Economic Reorder (EOQ)</th>
                <th className="px-5 py-3.5 text-right">Asset Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-medium">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-muted-foreground">Loading supply chain telemetry...</td>
                </tr>
              ) : (
                items.map((it) => (
                  <tr key={it.id} className="transition-colors hover:bg-secondary/40">
                    <td className="px-5 py-4 font-mono font-bold text-primary">{it.sku}</td>
                    <td className="px-5 py-4 font-semibold text-foreground">{it.product_name}</td>
                    <td className="px-5 py-4 text-muted-foreground">{it.category_name}</td>
                    <td className="px-5 py-4 font-mono font-bold text-foreground">
                      {it.current_stock > 500 ? "Unlimited (SaaS)" : `${it.current_stock} units`}
                    </td>
                    <td className="px-5 py-4 font-mono text-muted-foreground">{it.daily_demand_rate}/day</td>
                    <td className="px-5 py-4 font-mono font-bold">
                      {it.days_until_stockout > 500 ? (
                        <span className="text-muted-foreground">SLA Indefinite</span>
                      ) : (
                        <span className={it.days_until_stockout <= 7 ? "text-rose-500 font-bold" : it.days_until_stockout <= 15 ? "text-amber-500 font-bold" : "text-emerald-500 font-bold"}>
                          {it.days_until_stockout} days
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={it.stockout_risk} />
                    </td>
                    <td className="px-5 py-4 font-mono">
                      {it.recommended_reorder_qty > 0 ? (
                        <span className="font-bold text-amber-500">+{it.recommended_reorder_qty} units</span>
                      ) : (
                        <span className="text-muted-foreground">Adequate</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right font-mono font-bold text-foreground">
                      {formatCurrency(it.inventory_value)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
