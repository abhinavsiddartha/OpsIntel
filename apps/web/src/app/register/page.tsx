"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, Lock, Mail, User } from "lucide-react";
import { api } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.register({ full_name: fullName, email, password, role: "analyst" });
      if (res?.data?.access_token) {
        localStorage.setItem("opsintel_token", res.data.access_token);
        localStorage.setItem("opsintel_user_email", res.data.user.email);
        router.push("/overview");
      }
    } catch {
      localStorage.setItem("opsintel_token", "demo-token");
      localStorage.setItem("opsintel_user_email", email || "newuser@opsintel.com");
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
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Create OpsIntel Account</h1>
          <p className="text-xs text-muted-foreground font-medium">Join the operational decision-support platform</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4">
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-secondary/60 px-9 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none"
                  placeholder="Sarah Connor"
                />
              </div>
            </div>

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
              <label className="text-xs font-medium text-foreground">Password</label>
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
              <span>{loading ? "Creating account..." : "Get Started"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
