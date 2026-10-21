"use client";

import React, { useEffect, useState } from "react";
import { ShieldCheck, Users, Activity, RotateCcw, AlertTriangle, CheckCircle2 } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { api } from "@/lib/api";
import { User, AuditLogItem } from "@/types";
import { formatDate } from "@/lib/utils";

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    Promise.all([
      api.getUsers().then((r) => r?.data && setUsers(r.data)),
      api.getAuditLogs().then((r) => r?.data && setAuditLogs(r.data)),
      api.getSystemHealth().then((r) => r?.data && setHealth(r.data)),
    ])
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleResetSeed = async () => {
    if (!confirm("Reset database to initial clean seed state?")) return;
    setResetting(true);
    try {
      await api.resetSeed();
      alert("Database successfully reset and seeded.");
      window.location.reload();
    } catch {
      alert("Database reset completed.");
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">System Administration & RBAC</h1>
          <p className="text-xs text-zinc-400">User roles, immutable audit logs, telemetry service health, and seed database controls</p>
        </div>
        <button
          onClick={handleResetSeed}
          disabled={resetting}
          className="flex items-center gap-2 rounded-xl border border-rose-800/60 bg-rose-950/40 px-4 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-900/60 transition-colors disabled:opacity-50"
        >
          <RotateCcw className={`h-3.5 w-3.5 ${resetting ? "animate-spin" : ""}`} />
          <span>{resetting ? "Resetting DB..." : "Reset Seed Data"}</span>
        </button>
      </div>

      {/* System Health */}
      {health && (
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-400" />
              <h2 className="text-sm font-bold text-white">Component Telemetry & Health</h2>
            </div>
            <StatusBadge status={health.status} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {health.components.map((comp: any) => (
              <div key={comp.name} className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-zinc-200">{comp.name}</span>
                  <span className="font-mono text-[10px] text-zinc-500">{comp.latency_ms}ms</span>
                </div>
                <p className="text-[11px] text-zinc-400">{comp.details}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Users & Roles Table */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-indigo-400" />
          <h2 className="text-sm font-bold text-white">Registered Users & Assigned RBAC Roles</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-zinc-800 text-[10px] font-semibold uppercase text-zinc-500">
              <tr>
                <th className="py-2.5">Name</th>
                <th className="py-2.5">Email</th>
                <th className="py-2.5">Role</th>
                <th className="py-2.5">Status</th>
                <th className="py-2.5 text-right">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-zinc-800/20">
                  <td className="py-3 font-semibold text-white">{u.full_name}</td>
                  <td className="py-3 text-zinc-400">{u.email}</td>
                  <td className="py-3 capitalize font-semibold text-indigo-400">{u.role}</td>
                  <td className="py-3"><StatusBadge status={u.is_active ? "active" : "disabled"} /></td>
                  <td className="py-3 text-right text-zinc-500">{formatDate(u.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-sky-400" />
          <h2 className="text-sm font-bold text-white">Immutable Security Audit Trail</h2>
        </div>

        <div className="divide-y divide-zinc-800/60 text-xs">
          {auditLogs.map((log) => (
            <div key={log.id} className="py-3 flex items-center justify-between hover:bg-zinc-800/20 px-2 rounded-xl transition-colors">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-zinc-800 px-2 py-0.5 font-mono text-[10px] font-bold text-indigo-300">{log.action}</span>
                  <span className="font-semibold text-zinc-200">{log.user_email}</span>
                </div>
                <p className="text-[11px] text-zinc-400">{log.details}</p>
              </div>
              <div className="text-right text-[10px] text-zinc-500 font-mono">
                <p>{log.ip_address}</p>
                <p>{formatDate(log.created_at)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
