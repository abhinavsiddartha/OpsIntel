"use client";

import React, { useEffect, useState } from "react";
import { UserCheck, Award, TrendingUp } from "lucide-react";
import { api } from "@/lib/api";
import { Employee } from "@/types";
import { formatCurrency } from "@/lib/utils";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getEmployees()
      .then((res) => {
        if (res?.data) setEmployees(res.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Sales Team Quotas & Performance</h1>
          <p className="text-xs text-zinc-400">Individual target pacing, realized deal volumes, and ML target achievement probabilities</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <div className="col-span-full py-12 text-center text-zinc-500">Loading sales representatives...</div>
        ) : (
          employees.map((emp, idx) => (
            <div
              key={emp.id}
              className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 backdrop-blur-sm space-y-4 hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">{emp.name}</h3>
                  <p className="text-xs text-indigo-400">{emp.role_title}</p>
                  <span className="text-[10px] text-zinc-500">{emp.region_name}</span>
                </div>
                {idx === 0 && (
                  <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
                    <Award className="h-4 w-4" />
                  </span>
                )}
              </div>

              <div className="space-y-2 border-t border-zinc-800/60 pt-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Monthly Target:</span>
                  <span className="font-mono font-bold text-zinc-200">{formatCurrency(emp.monthly_target)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Current Realized:</span>
                  <span className="font-mono font-bold text-emerald-400">{formatCurrency(emp.current_revenue)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Pacing Quota:</span>
                  <span className="font-bold text-zinc-100">{emp.achievement_rate}%</span>
                </div>

                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-[10px] text-zinc-400">
                    <span>Target Hit Probability</span>
                    <span className="font-bold text-indigo-300">{emp.predicted_target_probability}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
                    <div
                      style={{ width: `${Math.min(emp.predicted_target_probability, 100)}%` }}
                      className="h-full rounded-full bg-indigo-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
