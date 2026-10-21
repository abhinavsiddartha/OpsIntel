"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  LayoutDashboard,
  TrendingUp,
  Users,
  Boxes,
  UserCheck,
  Target,
  BarChart3,
  BrainCircuit,
  Bot,
  BookOpen,
  FileText,
  Settings,
  ShieldCheck,
  X
} from "lucide-react";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const items = [
    { title: "Overview Dashboard", path: "/overview", icon: LayoutDashboard, category: "Navigation" },
    { title: "Sales & Transactions", path: "/sales", icon: TrendingUp, category: "Navigation" },
    { title: "Customer Intelligence", path: "/customers", icon: Users, category: "Navigation" },
    { title: "Inventory & Supply Chain", path: "/inventory", icon: Boxes, category: "Navigation" },
    { title: "Employee Performance", path: "/employees", icon: UserCheck, category: "Navigation" },
    { title: "Target Management", path: "/targets", icon: Target, category: "Navigation" },
    { title: "Analytics Engine", path: "/analytics", icon: BarChart3, category: "Navigation" },
    { title: "ML Intelligence Hub", path: "/intelligence", icon: BrainCircuit, category: "AI & ML" },
    { title: "AI Copilot Workspace", path: "/copilot", icon: Bot, category: "AI & ML" },
    { title: "RAG Knowledge Base", path: "/knowledge", icon: BookOpen, category: "AI & ML" },
    { title: "Executive Reports", path: "/reports", icon: FileText, category: "System" },
    { title: "System Administration", path: "/admin", icon: ShieldCheck, category: "System" },
    { title: "Settings & Preferences", path: "/settings", icon: Settings, category: "System" },
  ];

  const filtered = items.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onClose(); // toggle
      }
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 p-4 pt-[15vh] backdrop-blur-sm">
      <div className="w-full max-w-xl overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center border-b border-zinc-800 px-4">
          <Search className="h-4 w-4 text-zinc-400" />
          <input
            autoFocus
            type="text"
            placeholder="Search commands, modules, customers, ML predictions (Ctrl+K)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-12 w-full bg-transparent px-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none"
          />
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="py-6 text-center text-sm text-zinc-500">
              No matching modules or commands found.
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    router.push(item.path);
                    onClose();
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-zinc-300 transition-colors hover:bg-zinc-800/80 hover:text-zinc-100"
                >
                  <Icon className="h-4 w-4 text-zinc-400" />
                  <span className="flex-1 font-medium">{item.title}</span>
                  <span className="text-xs text-zinc-500">{item.category}</span>
                </button>
              );
            })
          )}
        </div>

        <div className="border-t border-zinc-800/80 bg-zinc-900/40 px-4 py-2 text-xs text-zinc-500 flex justify-between">
          <span>Navigation: Arrow keys / Click</span>
          <span>Press ESC to exit</span>
        </div>
      </div>
    </div>
  );
}
