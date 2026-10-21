"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const s = status.toLowerCase();
  
  let colorStyle = "bg-zinc-800 text-zinc-300 border-zinc-700";
  if (["completed", "operational", "production", "active", "optimal", "positive", "on track"].includes(s)) {
    colorStyle = "bg-emerald-950/60 text-emerald-400 border-emerald-800/60";
  } else if (["processing", "staging", "medium", "warning", "action required"].includes(s)) {
    colorStyle = "bg-amber-950/60 text-amber-400 border-amber-800/60";
  } else if (["critical", "high", "down", "cancelled", "archived", "negative", "severe"].includes(s)) {
    colorStyle = "bg-rose-950/60 text-rose-400 border-rose-800/60";
  } else if (["low", "info", "general"].includes(s)) {
    colorStyle = "bg-blue-950/60 text-blue-400 border-blue-800/60";
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border uppercase tracking-wider",
        colorStyle,
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
