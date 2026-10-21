"use client";

import React from "react";
import { X, Bell, AlertTriangle, CheckCircle, Info, ShieldAlert } from "lucide-react";
import { NotificationItem } from "@/types";
import { formatDate } from "@/lib/utils";

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkRead: (id: number) => void;
}

export function NotificationPanel({
  isOpen,
  onClose,
  notifications,
  onMarkRead,
}: NotificationPanelProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm border-l border-zinc-800 bg-zinc-950 p-5 shadow-2xl animate-in slide-in-from-right duration-200">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-zinc-300" />
          <h2 className="text-sm font-semibold text-zinc-100">Operational Notifications</h2>
        </div>
        <button onClick={onClose} className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 space-y-3 overflow-y-auto max-h-[85vh] pr-1">
        {notifications.length === 0 ? (
          <div className="py-12 text-center text-sm text-zinc-500">
            No active notifications.
          </div>
        ) : (
          notifications.map((n) => {
            const isCritical = n.severity === "critical";
            const isWarning = n.severity === "warning";
            const isSuccess = n.severity === "success";

            return (
              <div
                key={n.id}
                onClick={() => onMarkRead(n.id)}
                className="cursor-pointer rounded-xl border border-zinc-800/80 bg-zinc-900/60 p-3.5 transition-colors hover:border-zinc-700 hover:bg-zinc-900"
              >
                <div className="flex items-start gap-3">
                  {isCritical ? (
                    <ShieldAlert className="h-4 w-4 text-rose-400 mt-0.5" />
                  ) : isWarning ? (
                    <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5" />
                  ) : isSuccess ? (
                    <CheckCircle className="h-4 w-4 text-emerald-400 mt-0.5" />
                  ) : (
                    <Info className="h-4 w-4 text-blue-400 mt-0.5" />
                  )}
                  <div className="flex-1 space-y-1">
                    <p className="text-xs font-semibold text-zinc-200">{n.title}</p>
                    <p className="text-xs text-zinc-400 leading-relaxed">{n.message}</p>
                    <span className="inline-block text-[10px] text-zinc-500">{formatDate(n.created_at)}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
