"use client";

import React, { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  Eye,
  BarChart3,
  Users,
  Target,
  TrendingUp,
  ShieldAlert,
  ArrowRight
} from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { api } from "@/lib/api";
import { Order, Customer, CustomerSegmentItem, TargetItem } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function SalesPage() {
  const [activeTab, setActiveTab] = useState<"orders" | "accounts" | "quotas">("orders");
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [segments, setSegments] = useState<CustomerSegmentItem[]>([]);
  const [targets, setTargets] = useState<TargetItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: "15",
        ...(search ? { search } : {}),
        ...(status ? { status } : {}),
      });
      const res = await api.getOrders(params.toString());
      if (res?.data) {
        setOrders(res.data);
        if (res.meta) {
          setTotalPages(res.meta.totalPages);
          setTotal(res.meta.total);
        }
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    api.getCustomers().then((r) => r?.data && setCustomers(r.data)).catch(() => {});
    api.getSegments().then((r) => r?.data && setSegments(r.data)).catch(() => {});
    api.getTargets().then((r) => r?.data && setTargets(r.data)).catch(() => {});
  }, [page, status]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadOrders();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Commercial Decisions & Pipeline</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Revenue Operations</h1>
          <p className="text-xs text-muted-foreground">Identifying commercial risks, transaction order governance, and customer health tiers</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => alert("Exporting Revenue Operations telemetry report (CSV)...")}
            className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-xs font-medium text-foreground transition-colors hover:border-ring"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-2">
        <button
          onClick={() => setActiveTab("orders")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
            activeTab === "orders"
              ? "bg-primary text-primary-foreground font-bold shadow-sm"
              : "border border-border bg-card text-muted-foreground hover:border-ring hover:text-foreground"
          }`}
        >
          <BarChart3 className="h-3.5 w-3.5" />
          <span>Transactions & Orders Ledger</span>
        </button>
        <button
          onClick={() => setActiveTab("accounts")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
            activeTab === "accounts"
              ? "bg-primary text-primary-foreground font-bold shadow-sm"
              : "border border-border bg-card text-muted-foreground hover:border-ring hover:text-foreground"
          }`}
        >
          <Users className="h-3.5 w-3.5" />
          <span>Account Health & RFM Segments</span>
        </button>
        <button
          onClick={() => setActiveTab("quotas")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
            activeTab === "quotas"
              ? "bg-primary text-primary-foreground font-bold shadow-sm"
              : "border border-border bg-card text-muted-foreground hover:border-ring hover:text-foreground"
          }`}
        >
          <Target className="h-3.5 w-3.5" />
          <span>Team Quotas & Targets</span>
        </button>
      </div>

      {/* Tab 1: Orders */}
      {activeTab === "orders" && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between shadow-sm">
            <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search order # or client name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-border bg-secondary/50 px-9 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none"
              />
            </form>

            <div className="flex items-center gap-3">
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                className="rounded-xl border border-border bg-secondary/50 px-3 py-2 text-xs text-foreground focus:border-ring focus:outline-none"
              >
                <option value="">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="processing">Processing</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <span className="text-xs text-muted-foreground font-mono">
                Total: <strong className="text-foreground">{total}</strong> orders
              </span>
            </div>
          </div>

          {/* Orders Table */}
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-secondary/30 text-[11px] font-semibold uppercase text-muted-foreground">
                <tr>
                  <th className="px-5 py-3.5">Order ID</th>
                  <th className="px-5 py-3.5">Client Account</th>
                  <th className="px-5 py-3.5">Items</th>
                  <th className="px-5 py-3.5">Order Value</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Region</th>
                  <th className="px-5 py-3.5">Date</th>
                  <th className="px-5 py-3.5 text-right">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-medium">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-secondary/40 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-bold text-primary">{order.order_number}</td>
                    <td className="px-5 py-3.5 font-semibold text-foreground">{order.customer_name || "Enterprise Client"}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{order.items ? order.items.length : 1} line item</td>
                    <td className="px-5 py-3.5 font-mono font-bold text-foreground">{formatCurrency(order.total_amount)}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={order.status} /></td>
                    <td className="px-5 py-3.5 text-muted-foreground">{order.region_name || "Global"}</td>
                    <td className="px-5 py-3.5 text-muted-foreground">{formatDate(order.order_date)}</td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="rounded-lg border border-border p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between border-t border-border px-5 py-3 text-xs text-muted-foreground bg-secondary/20">
              <span>Page {page} of {totalPages}</span>
              <div className="flex items-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded-lg border border-border p-1.5 disabled:opacity-40 hover:bg-secondary"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-lg border border-border p-1.5 disabled:opacity-40 hover:bg-secondary"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Accounts & RFM Segments */}
      {activeTab === "accounts" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {segments.map((s) => (
              <div key={s.segment_name} className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground">{s.segment_name}</h3>
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-mono font-bold text-primary border border-border">
                    {s.customer_count} Accounts
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.description}</p>
                <div className="pt-2 border-t border-border flex justify-between text-xs">
                  <span className="text-muted-foreground">Avg LTV:</span>
                  <span className="font-mono font-bold text-foreground">{formatCurrency(s.avg_ltv)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <div className="p-4 border-b border-border flex justify-between items-center">
              <h3 className="text-sm font-bold text-foreground">Enterprise Customer Directory</h3>
              <span className="text-xs text-muted-foreground font-mono">Indexed: {customers.length} Accounts</span>
            </div>
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-secondary/30 text-[11px] font-semibold uppercase text-muted-foreground">
                <tr>
                  <th className="px-5 py-3.5">Customer Code</th>
                  <th className="px-5 py-3.5">Company</th>
                  <th className="px-5 py-3.5">Segment</th>
                  <th className="px-5 py-3.5">Lifetime Value</th>
                  <th className="px-5 py-3.5">Churn Risk</th>
                  <th className="px-5 py-3.5">Last Order</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-medium">
                {customers.slice(0, 15).map((c) => (
                  <tr key={c.id} className="hover:bg-secondary/40 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-primary font-bold">{c.customer_code}</td>
                    <td className="px-5 py-3.5 font-semibold text-foreground">{c.name}</td>
                    <td className="px-5 py-3.5"><span className="badge rounded px-2 py-0.5 text-[10px] bg-secondary border border-border text-foreground">{c.segment_name}</span></td>
                    <td className="px-5 py-3.5 font-mono font-bold text-foreground">{formatCurrency(c.lifetime_value)}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={c.churn_risk_level} /></td>
                    <td className="px-5 py-3.5 text-muted-foreground">{c.last_order_date ? c.last_order_date.split("T")[0] : "Recent"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Team Quotas */}
      {activeTab === "quotas" && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {targets.map((t) => (
            <div key={t.id} className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-foreground">{t.title}</h3>
                  <p className="text-xs text-muted-foreground font-mono">Target Period: {t.period}</p>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold border ${
                  t.achievement_rate >= 100
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    : "bg-primary/10 text-primary border-primary/20"
                }`}>
                  {Math.round(t.achievement_rate)}%
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Current: {formatCurrency(t.actual_value)}</span>
                  <span className="font-semibold text-foreground">Target: {formatCurrency(t.target_value)}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    style={{ width: `${Math.min(t.achievement_rate, 100)}%` }}
                    className={`h-full rounded-full ${t.achievement_rate >= 100 ? "bg-emerald-500" : "bg-primary"}`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Line Items Drawer Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-base font-bold text-foreground">{selectedOrder.order_number}</h3>
                <p className="text-xs text-muted-foreground">Account: {selectedOrder.customer_name || "Enterprise Client"}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="rounded-lg border border-border p-1 text-xs text-muted-foreground hover:bg-secondary"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Date:</span>
                <span className="font-mono text-foreground">{formatDate(selectedOrder.order_date)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Region:</span>
                <span className="text-foreground">{selectedOrder.region_name || "Global"}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Total Amount:</span>
                <span className="font-mono font-bold text-foreground text-sm">{formatCurrency(selectedOrder.total_amount)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Status:</span>
                <StatusBadge status={selectedOrder.status} />
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full rounded-xl bg-primary py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
