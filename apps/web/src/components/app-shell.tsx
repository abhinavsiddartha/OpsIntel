"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  BrainCircuit,
  BarChart3,
  Boxes,
  Settings,
  ChevronLeft,
  ChevronRight,
  Bell,
  Search,
  Moon,
  Sun,
  LogOut,
} from "lucide-react";
import { useTheme } from "./theme-provider";
import { CommandPalette } from "./command-palette";
import { NotificationPanel } from "./notification-panel";
import { api } from "@/lib/api";
import { NotificationItem } from "@/types";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [userEmail, setUserEmail] = useState("admin@opsintel.com");

  useEffect(() => {
    let token = localStorage.getItem("opsintel_token");
    if (!token) {
      token = "demo-jwt-token-2026";
      localStorage.setItem("opsintel_token", token);
      localStorage.setItem("opsintel_user_email", "admin@opsintel.com");
      localStorage.setItem("opsintel_user_role", "admin");
    }
    const email = localStorage.getItem("opsintel_user_email") || "admin@opsintel.com";
    setUserEmail(email);

    api.getNotifications()
      .then((res) => {
        if (res?.data) setNotifications(res.data);
      })
      .catch(() => {});
  }, [pathname, router]);

  // 4 Core Enterprise Decision Pillars
  const navItems = [
    {
      label: "Executive Command",
      path: "/overview",
      icon: Activity,
      badge: "Signals",
      badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    },
    {
      label: "Intelligence Hub",
      path: "/intelligence",
      icon: BrainCircuit,
      badge: "Predictive",
      badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    },
    {
      label: "Revenue Operations",
      path: "/sales",
      icon: BarChart3,
    },
    {
      label: "Supply Chain",
      path: "/inventory",
      icon: Boxes,
      badge: "Defense",
      badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    },
  ];

  const adminItems = [
    { label: "Platform Settings", path: "/settings", icon: Settings },
  ];

  const isAuthPage = ["/", "/login", "/register", "/forgot-password"].includes(pathname);
  if (isAuthPage) {
    return <>{children}</>;
  }

  const handleLogout = () => {
    localStorage.removeItem("opsintel_token");
    localStorage.removeItem("opsintel_user_email");
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-200">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-border bg-card/95 backdrop-blur-md transition-all duration-300 ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Brand */}
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <Link href="/overview" className="flex items-center gap-3 overflow-hidden">
            {/* Bespoke Geometric Nexus Logomark */}
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-secondary text-foreground shadow-sm">
              <svg className="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 3v6" />
                <path d="M12 15v6" />
                <path d="M3 12h6" />
                <path d="M15 12h6" />
              </svg>
            </div>
            {!collapsed && (
              <div className="flex flex-col truncate">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold tracking-wider text-foreground">OPSINTEL</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>
                <span className="text-[9px] font-mono tracking-tight text-muted-foreground uppercase">Decision Support</span>
              </div>
            )}
          </Link>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground md:flex transition-colors"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation links */}
        <div className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          <div className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {!collapsed ? "Core Workspaces" : "Pillars"}
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path || (item.path !== "/overview" && pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/25 font-semibold"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                {!collapsed && (
                  <span className="flex-1 truncate">{item.label}</span>
                )}
                {!collapsed && item.badge && (
                  <span className={`rounded px-1.5 py-0.5 text-[10px] font-mono border ${item.badgeColor || "bg-secondary text-muted-foreground border-border"}`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="my-4 border-t border-border pt-4">
            <div className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {!collapsed ? "System" : "Sys"}
            </div>
            {adminItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                    isActive
                      ? "bg-primary/10 text-primary border border-primary/25 font-semibold"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </div>
        </div>

        {/* User Profile bottom */}
        <div className="border-t border-border p-3">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <div className="truncate pr-2">
                <p className="text-xs font-semibold text-foreground truncate">{userEmail}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  <span className="text-[10px] font-mono text-muted-foreground">Ledger Sync: OK</span>
                </div>
              </div>
            )}
            <button
              onClick={handleLogout}
              title="Logout"
              className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-destructive transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex flex-1 flex-col transition-all duration-300 ${collapsed ? "md:pl-16" : "md:pl-64"}`}>
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/80 px-6 backdrop-blur-md">
          {/* Quick Search */}
          <button
            onClick={() => setCommandOpen(true)}
            className="flex items-center gap-3 rounded-lg border border-border bg-secondary/60 px-3.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-ring hover:text-foreground w-64 md:w-80"
          >
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="flex-1 text-left truncate">Search signals, orders, SKUs...</span>
            <kbd className="rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">
              Ctrl+K
            </kbd>
          </button>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-lg border border-border bg-secondary/60 p-2 text-muted-foreground transition-colors hover:border-ring hover:text-foreground"
              title="Toggle Theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-primary" />}
            </button>

            <button
              onClick={() => setNotifOpen(true)}
              className="relative rounded-lg border border-border bg-secondary/60 p-2 text-muted-foreground transition-colors hover:border-ring hover:text-foreground"
              title="Operational Signals & Anomalies"
            >
              <Bell className="h-4 w-4" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white">
                  {notifications.length}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>

      {/* Global Command Palette */}
      <CommandPalette isOpen={commandOpen} onClose={() => setCommandOpen(false)} />

      {/* Slide-out Notifications Panel */}
      <NotificationPanel
        isOpen={notifOpen}
        onClose={() => setNotifOpen(false)}
        notifications={notifications}
        onMarkRead={(id) => {
          api.markNotificationRead(id).catch(() => {});
          setNotifications((prev) => prev.filter((n) => n.id !== id));
        }}
      />
    </div>
  );
}
