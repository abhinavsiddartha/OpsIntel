"use client";

import React, { useState } from "react";
import { FileText, Download, CheckCircle2, Calendar, Sparkles } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function ReportsPage() {
  const [generating, setGenerating] = useState(false);
  const [selectedReport, setSelectedReport] = useState("executive");

  const reports = [
    { id: "executive", title: "Executive Operations Quarterly Review", period: "2026-Q1", size: "1.4 MB", type: "PDF" },
    { id: "supply", title: "Supply Chain Risk & Stockout Forecast", period: "March 2026", size: "840 KB", type: "PDF" },
    { id: "churn", title: "Customer RFM Segmentation & Churn Matrix", period: "March 2026", size: "620 KB", type: "CSV" },
    { id: "audit", title: "Discount Governance & Anomaly Audit Log", period: "Q1 2026", size: "480 KB", type: "CSV" },
  ];

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      alert("Executive report successfully compiled and downloaded!");
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Executive Reporting & Briefs</h1>
          <p className="text-xs text-zinc-400">Automated business review documents, supply chain assessments, and compliance audits</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {reports.map((r) => (
          <div
            key={r.id}
            className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 space-y-4 hover:border-zinc-700 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-950 border border-indigo-800/60 text-indigo-400">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{r.title}</h3>
                  <span className="text-xs text-zinc-400">{r.period} • {r.size} • {r.type}</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              Synthesizes real-time performance indicators, ML predictions, and operational risk mitigation items into a board-ready report.
            </p>

            <button
              onClick={handleGenerate}
              disabled={generating}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-800/80 py-2.5 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{generating ? "Compiling Report..." : `Download ${r.type}`}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
