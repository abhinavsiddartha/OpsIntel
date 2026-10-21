"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Mail, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6 text-foreground">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Reset Password</h1>
          <p className="text-xs text-muted-foreground font-medium">Enter your email to receive recovery instructions</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-xl space-y-4">
          {submitted ? (
            <div className="space-y-4 text-center py-4">
              <CheckCircle className="h-10 w-10 text-emerald-500 mx-auto" />
              <p className="text-sm font-semibold text-foreground">Recovery email sent</p>
              <p className="text-xs text-muted-foreground">Check your inbox for a secure token to reset your credentials.</p>
              <Link
                href="/login"
                className="inline-block rounded-xl bg-secondary border border-border px-5 py-2 text-xs font-semibold text-foreground hover:bg-secondary/80"
              >
                Back to Sign In
              </Link>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              className="space-y-4"
            >
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

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90"
              >
                <span>Send Instructions</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Remember your password?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
