"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  Bot,
  ShieldCheck,
  Zap,
  BarChart3,
  Layers,
  Database,
  Cpu,
  Lock,
  Boxes,
  Users
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-indigo-500 selection:text-white">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-zinc-800/80 bg-zinc-950/80 px-6 backdrop-blur-md md:px-12">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 text-white shadow-sm">
            <svg className="h-4 w-4 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 3v6" />
              <path d="M12 15v6" />
              <path d="M3 12h6" />
              <path d="M15 12h6" />
            </svg>
          </div>
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold tracking-wider text-white">OPSINTEL</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <span className="text-[9px] font-mono tracking-tight text-zinc-400 uppercase">Operational Decision Platform</span>
          </div>
        </div>

        <nav className="hidden items-center gap-8 text-sm font-medium text-zinc-400 md:flex">
          <Link href="/overview" className="transition-colors hover:text-zinc-100">Executive Command</Link>
          <Link href="/intelligence" className="transition-colors hover:text-zinc-100">Intelligence Hub</Link>
          <Link href="/sales" className="transition-colors hover:text-zinc-100">Revenue Operations</Link>
          <Link href="/inventory" className="transition-colors hover:text-zinc-100">Supply Chain Defense</Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:text-white"
          >
            Sign In
          </Link>
          <Link
            href="/overview"
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition-all hover:bg-indigo-500"
          >
            <span>Launch Platform</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-6 pt-20 pb-24 text-center md:px-12 md:pt-28 md:pb-32">
        {/* Glow effect */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-indigo-600/15 blur-[120px]" />

        <div className="mx-auto max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-950/40 px-3.5 py-1 text-xs font-mono text-indigo-300 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400"></span>
            <span>ENTERPRISE OPERATIONAL DECISION-SUPPORT PLATFORM</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl sm:leading-[1.15]">
            Connect business signals. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
              Detect risks. Drive action.
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-base text-zinc-400 sm:text-lg">
            OpsIntel connects live relational enterprise ledgers, forecasts multi-horizon trajectory with 95% statistical confidence, and provides a parameter-verified Copilot to explain evidence across ERP, CRM, and supply chain data.
          </p>

          <div className="flex flex-col items-center justify-center gap-3 pt-4 sm:flex-row">
            <Link
              href="/overview"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-indigo-600/30 transition-all hover:bg-indigo-500 sm:w-auto"
            >
              <span>Launch Executive Command</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/intelligence"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/80 px-6 py-3.5 text-sm font-semibold text-zinc-300 backdrop-blur-sm transition-all hover:border-zinc-700 hover:bg-zinc-800 sm:w-auto"
            >
              <BrainCircuit className="h-4 w-4 text-indigo-400" />
              <span>Inspect Intelligence Hub</span>
            </Link>
          </div>
        </div>

        {/* Hero Interactive Preview */}
        <div className="mx-auto mt-16 max-w-5xl overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3 text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-500/80" />
              <span className="h-3 w-3 rounded-full bg-amber-500/80" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 font-mono text-[11px] text-zinc-500">opsintel.internal/analytics/overview</span>
            </div>
            <span className="rounded bg-indigo-950 px-2 py-0.5 font-medium text-indigo-300 border border-indigo-800/50">LIVE TELEMETRY</span>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 text-left">
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-4">
              <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium">Monthly Revenue</p>
              <p className="text-2xl font-bold text-white mt-1">$482,500</p>
              <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-medium mt-1">
                <TrendingUp className="h-3 w-3" /> +12.4% vs last month
              </span>
            </div>
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-4">
              <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium">Forecasted 30D Sales</p>
              <p className="text-2xl font-bold text-white mt-1">$541,200</p>
              <span className="text-xs text-indigo-400 font-medium mt-1">95% Confidence Band</span>
            </div>
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-4">
              <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium">Stockout Risk SKUs</p>
              <p className="text-2xl font-bold text-amber-400 mt-1">2 Hardware Lines</p>
              <span className="text-xs text-zinc-400 mt-1">Reorder PO triggered</span>
            </div>
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-4">
              <p className="text-xs text-zinc-500 uppercase tracking-wider font-medium">AI Decision Copilot</p>
              <p className="text-sm font-semibold text-indigo-300 mt-2">Active Reasoning Core</p>
              <span className="text-xs text-zinc-400 mt-1">4 Grounded Sources Cited</span>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Grid */}
      <section id="capabilities" className="border-t border-zinc-800/80 bg-zinc-950 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="text-center space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">Enterprise Modules</span>
            <h2 className="text-3xl font-bold text-white tracking-tight">Built for modern data-driven enterprises</h2>
            <p className="text-zinc-400 text-sm max-w-xl mx-auto">
              Unified telemetry uniting executive sales analytics, supply chain risks, customer retention, and AI automation into a single platform.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-950/80 border border-indigo-800/60 flex items-center justify-center text-indigo-400">
                <BarChart3 className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-white">Full-Stack Analytics</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Relational SQL aggregations, multi-dimensional time filters, regional performance maps, and product leaderboards.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-purple-950/80 border border-purple-800/60 flex items-center justify-center text-purple-400">
                <BrainCircuit className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-white">6 Production ML Engines</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Multi-horizon sales forecaster, customer churn classifier, stockout prediction, target probability, anomaly detection, and RFM clustering.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-sky-950/80 border border-sky-800/60 flex items-center justify-center text-sky-400">
                <Bot className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-white">AI Business Copilot & RAG</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Context-aware natural language inquiries grounded in real database transactions and organizational vector document retrieval.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Section */}
      <section id="architecture" className="border-t border-zinc-800/80 bg-zinc-900/30 px-6 py-24 md:px-12">
        <div className="mx-auto max-w-5xl">
          <div className="text-center space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">System Design</span>
            <h2 className="text-3xl font-bold text-white tracking-tight">Production Architecture</h2>
            <p className="text-zinc-400 text-sm max-w-xl mx-auto">
              Engineered with clean separation of concerns, strict type-safety, and enterprise security guardrails.
            </p>
          </div>

          <div className="mt-12 rounded-2xl border border-zinc-800 bg-zinc-950 p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="space-y-2 border-l-2 border-indigo-500 pl-4">
                <p className="text-sm font-bold text-white">Frontend Layer</p>
                <p className="text-xs text-zinc-400">Next.js 14 App Router, TypeScript, Tailwind CSS, Lucide React, Framer Motion, and Recharts.</p>
              </div>
              <div className="space-y-2 border-l-2 border-purple-500 pl-4">
                <p className="text-sm font-bold text-white">API & Inference Layer</p>
                <p className="text-xs text-zinc-400">FastAPI, Python 3.10+, SQLAlchemy ORM, Scikit-learn, Scipy, Numpy, and Pydantic v2.</p>
              </div>
              <div className="space-y-2 border-l-2 border-sky-500 pl-4">
                <p className="text-sm font-bold text-white">Storage & RAG Core</p>
                <p className="text-xs text-zinc-400">SQLite (Zero-config out of the box) & PostgreSQL/pgvector production compatibility with TF-IDF Vector Index.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-zinc-800/80 bg-zinc-950 px-6 py-20 text-center md:px-12">
        <div className="mx-auto max-w-3xl space-y-6">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Build decisions on real intelligence.
          </h2>
          <p className="text-zinc-400 text-sm max-w-xl mx-auto">
            Experience the full OpsIntel workspace now with pre-seeded enterprise accounts.
          </p>
          <div className="pt-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-7 py-3.5 text-sm font-semibold text-white shadow-xl shadow-indigo-600/30 transition-all hover:bg-indigo-500"
            >
              <span>Launch OpsIntel Platform</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 px-6 py-8 text-center text-xs text-zinc-500">
        <p>© 2026 OpsIntel Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}
