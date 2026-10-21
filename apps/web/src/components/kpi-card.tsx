"use client";

import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  value: string;
  changePct: number;
  trend: "up" | "down" | "neutral";
  sparkline?: number[];
  unit?: string;
  className?: string;
}

export function KpiCard({
  title,
  value,
  changePct,
  trend,
  sparkline = [],
  unit,
  className,
}: KpiCardProps) {
  const isPositive = trend === "up";
  const isNeutral = trend === "neutral";

  // Simple SVG sparkline generator
  const maxVal = Math.max(...sparkline, 1);
  const minVal = Math.min(...sparkline, 0);
  const range = maxVal - minVal || 1;
  const points = sparkline
    .map((val, i) => {
      const x = (i / (sparkline.length - 1 || 1)) * 100;
      const y = 30 - ((val - minVal) / range) * 25;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:border-ring/50",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </span>
        <div
          className={cn(
            "flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold border",
            isNeutral
              ? "bg-secondary text-muted-foreground border-border"
              : isPositive
              ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
              : "bg-rose-500/10 text-rose-500 border-rose-500/20"
          )}
        >
          {isNeutral ? (
            <Minus className="h-3 w-3" />
          ) : isPositive ? (
            <TrendingUp className="h-3 w-3" />
          ) : (
            <TrendingDown className="h-3 w-3" />
          )}
          <span>{changePct >= 0 ? `+${changePct}%` : `${changePct}%`}</span>
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <div className="text-2xl font-bold tracking-tight text-foreground">
          {value}
        </div>
        {sparkline.length > 1 && (
          <div className="h-8 w-24">
            <svg className="h-full w-full overflow-visible" viewBox="0 0 100 30">
              <polyline
                fill="none"
                stroke={isPositive ? "#10B981" : isNeutral ? "#94A3B8" : "#EF4444"}
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
              />
            </svg>
          </div>
        )}
      </div>

      <div className="mt-2 text-xs text-muted-foreground">vs. previous period</div>
    </div>
  );
}
