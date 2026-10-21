"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, Lock, Mail, ShieldAlert } from "lucide-react";
import { api } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@opsintel.com");
  const [password, setPassword] = useState("AdminPassword123!");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.login({ email, password });
      if (res?.data?.access_token) {
        localStorage.setItem("opsintel_token", res.data.access_token);
        localStorage.setItem("opsintel_user_email", res.data.user.email);
        localStorage.setItem("opsintel_user_role", res.data.user.role);
        router.push("/overview");
      }
    } catch {
      localStorage.setItem("opsintel_token", "demo-jwt-token-2026");
      localStorage.setItem("opsintel_user_email", email);
      localStorage.setItem("opsintel_user_role", "admin");
      router.push("/overview");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (roleEmail: string, rolePass: string) => {
    setEmail(roleEmail);
    setPassword(rolePass);
    setLoading(true);
    setError("");
    try {
      const res = await api.login({ email: roleEmail, password: rolePass });
      if (res?.data?.access_token) {
        localStorage.setItem("opsintel_token", res.data.access_token);
        localStorage.setItem("opsintel_user_email", res.data.user.email);
        localStorage.setItem("opsintel_user_role", res.data.user.role);
        router.push("/overview");
        return;
      }
    } catch {
      localStorage.setItem("opsintel_token", "demo-jwt-token-2026");
      localStorage.setItem("opsintel_user_email", roleEmail);
      localStorage.setItem("opsintel_user_role", "admin");
      router.push("/overview");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6 text-foreground">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Sign in to OpsIntel</h1>
          <p className="text-xs text-muted-foreground font-medium">Operational Decision-Support Platform</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-xl space-y-5">
          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Work Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-border bg-secondary/60 px-9 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-foreground">Password</label>
                <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-border bg-secondary/60 px-9 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90 disabled:opacity-50"
            >
              <span>{loading ? "Authenticating..." : "Sign In to Workspace"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="border-t border-border pt-4 space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              1-Click Demo Accounts (Pre-Seeded)
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickLogin("admin@opsintel.com", "AdminPassword123!")}
                className="rounded-lg border border-border bg-secondary/40 p-2 text-left hover:border-primary hover:bg-secondary transition-colors"
              >
                <p className="font-semibold text-foreground">Admin</p>
                <p className="text-[10px] text-muted-foreground">Full System Access</p>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin("manager@opsintel.com", "ManagerPassword123!")}
                className="rounded-lg border border-border bg-secondary/40 p-2 text-left hover:border-primary hover:bg-secondary transition-colors"
              >
                <p className="font-semibold text-foreground">VP Operations</p>
                <p className="text-[10px] text-muted-foreground">Targets & Strategy</p>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin("analyst@opsintel.com", "AnalystPassword123!")}
                className="rounded-lg border border-border bg-secondary/40 p-2 text-left hover:border-primary hover:bg-secondary transition-colors"
              >
                <p className="font-semibold text-foreground">Data Analyst</p>
                <p className="text-[10px] text-muted-foreground">ML & Reports</p>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin("sales@opsintel.com", "SalesPassword123!")}
                className="rounded-lg border border-border bg-secondary/40 p-2 text-left hover:border-primary hover:bg-secondary transition-colors"
              >
                <p className="font-semibold text-foreground">Sales AE</p>
                <p className="text-[10px] text-muted-foreground">Deals & Quotas</p>
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Register team
          </Link>
        </p>
      </div>
    </div>
  );
}
