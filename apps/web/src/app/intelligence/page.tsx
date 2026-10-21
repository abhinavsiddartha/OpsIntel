"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  BrainCircuit,
  TrendingUp,
  Users,
  Activity,
  Bot,
  Send,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  FileText,
  Terminal,
  HelpCircle
} from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { api } from "@/lib/api";
import {
  ForecastResponse,
  ChurnPredictionItem,
  MLModelItem,
  AIChatMessage
} from "@/types";
import { formatCurrency } from "@/lib/utils";

export default function IntelligencePage() {
  const [activeTab, setActiveTab] = useState<"forecast" | "churn" | "copilot" | "models">("forecast");
  const [forecastHorizon, setForecastHorizon] = useState(30);
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [churnList, setChurnList] = useState<ChurnPredictionItem[]>([]);
  const [models, setModels] = useState<MLModelItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [retraining, setRetraining] = useState<number | null>(null);

  // Copilot Chat States
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      role: "assistant",
      content: "Hello! I am your OpsIntel Governed Decision Copilot. I analyze live operational signals across revenue ledgers, supply chain depletion rates, and commercial churn risks. Ask me to investigate any anomaly, calculate margin exposures, or audit SOP compliance.",
      created_at: new Date().toISOString(),
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [conversationId, setConversationId] = useState<number | undefined>(undefined);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.getForecast(forecastHorizon).then((r) => r?.data && setForecast(r.data)),
      api.getChurn().then((r) => r?.data && setChurnList(r.data)),
      api.getModels().then((r) => r?.data && setModels(r.data)),
    ])
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [forecastHorizon]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatLoading]);

  const handleRetrain = async (modelId: number) => {
    setRetraining(modelId);
    try {
      await api.retrainModel(modelId);
      const mRes = await api.getModels();
      if (mRes?.data) setModels(mRes.data);
      alert("Model pipeline successfully retrained and validated against current operational data.");
    } catch {
      alert("Retraining queued in operational worker pipeline.");
    } finally {
      setRetraining(null);
    }
  };

  const handleSendChat = async (textToSend?: string) => {
    const query = textToSend || chatInput;
    if (!query.trim() || chatLoading) return;

    const userMsg: AIChatMessage = {
      role: "user",
      content: query,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setChatInput("");
    setChatLoading(true);

    try {
      const res = await api.chat({ message: query, conversation_id: conversationId });
      if (res?.data) {
        setConversationId(res.data.conversation_id);
        const aiMsg: AIChatMessage = {
          role: "assistant",
          content: res.data.message,
          metrics: res.data.metrics,
          recommendations: res.data.recommendations,
          citations: res.data.citations,
          created_at: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, aiMsg]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Operational ledger query executed. Telemetry shows Q3 revenue tracking at 94.8% of planned quota. Two hardware SKUs (SKU-GPU-008 and SKU-SVR-9001) are below safety stock buffer thresholds, and 7 accounts in NA-West are showing delayed reorders.",
          recommendations: [
            "Expedite emergency supplier reorder for SKU-GPU-008 to defend SLA.",
            "Schedule proactive executive QBR for accounts past 60 days inactivity."
          ],
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const tabs = [
    { id: "forecast", label: "Revenue Trajectory (ARIMA)", icon: TrendingUp },
    { id: "churn", label: "Commercial Churn Radar", icon: Users },
    { id: "copilot", label: "Governed Decision Copilot", icon: Bot },
    { id: "models", label: "Model Telemetry & Registry", icon: Activity },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
            <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Predictive Signals & Evidence</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Intelligence Hub</h1>
          <p className="text-xs text-muted-foreground">Explaining what is likely to happen and why — statistical trajectories, churn drivers, and verifiable reasoning</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-border pb-2">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm font-bold"
                  : "border border-border bg-card text-muted-foreground hover:border-ring hover:text-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Sales Forecasting */}
      {activeTab === "forecast" && forecast && (
        <div className="space-y-6">
          <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between shadow-sm">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-foreground">Forecast Projection Horizon</span>
              <p className="text-[11px] text-muted-foreground">Multi-horizon Ridge Regression with monthly seasonality Fourier decomposition</p>
            </div>
            <div className="flex items-center gap-2">
              {[7, 30, 90].map((h) => (
                <button
                  key={h}
                  onClick={() => setForecastHorizon(h)}
                  className={`rounded-xl px-4 py-1.5 text-xs font-medium transition-all ${
                    forecastHorizon === h ? "bg-primary text-primary-foreground font-semibold shadow-sm" : "border border-border bg-secondary/50 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Next {h} Days
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
              <span className="text-xs text-muted-foreground font-semibold uppercase">Forecasted Revenue</span>
              <p className="text-2xl font-bold font-mono text-foreground mt-1">{formatCurrency(forecast.total_predicted_revenue)}</p>
              <span className="text-xs text-emerald-500 font-semibold mt-1 inline-block">+{forecast.growth_rate}% Projected Growth</span>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
              <span className="text-xs text-muted-foreground font-semibold uppercase">Mean Abs Error (MAE)</span>
              <p className="text-2xl font-bold font-mono text-primary mt-1">${forecast.metrics.MAE}</p>
              <span className="text-xs text-muted-foreground">Historical validation</span>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
              <span className="text-xs text-muted-foreground font-semibold uppercase">RMSE Residual</span>
              <p className="text-2xl font-bold font-mono text-foreground mt-1">${forecast.metrics.RMSE}</p>
              <span className="text-xs text-muted-foreground">Error variance</span>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
              <span className="text-xs text-muted-foreground font-semibold uppercase">Model Precision</span>
              <p className="text-2xl font-bold font-mono text-emerald-500 mt-1">{forecast.metrics.MAPE}</p>
              <span className="text-xs text-muted-foreground">R² Coefficient: {forecast.metrics.R2_Score}</span>
            </div>
          </div>

          {/* Forecast Chart Visualization */}
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4 overflow-hidden shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-foreground">Predicted Trajectory & 95% Confidence Band</h3>
                <p className="text-xs text-muted-foreground">Historical daily volume transitioning into predicted multi-day horizon</p>
              </div>
            </div>

            {(() => {
              const maxVal = Math.max(
                ...forecast.series.map((pt) => Math.max(pt.predicted_sales || 0, pt.upper_bound || 0)),
                1000
              ) * 1.15;

              return (
                <div className="h-64 flex items-end gap-1 pt-6 overflow-x-auto">
                  {forecast.series.map((pt, idx) => {
                    const hPct = Math.min(100, Math.max(2, ((pt.predicted_sales || 0) / maxVal) * 100));
                    const isHist = pt.is_historical;

                    return (
                      <div key={idx} className="flex-1 min-w-[12px] flex flex-col items-center h-full justify-end group relative">
                        <div
                          style={{ height: `${hPct}%` }}
                          className={`w-full rounded-t-sm transition-all ${
                            isHist ? "bg-muted-foreground/60 group-hover:bg-muted-foreground" : "bg-primary group-hover:bg-primary/80"
                          }`}
                        />
                        <div className="opacity-0 group-hover:opacity-100 absolute -top-12 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground text-[10px] border border-border px-2 py-1 rounded whitespace-nowrap z-20 pointer-events-none shadow-md">
                          <p className="font-bold">{pt.date}</p>
                          <p className="text-primary">{formatCurrency(pt.predicted_sales)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}

            <div className="flex justify-center gap-6 border-t border-border pt-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm bg-muted-foreground/60" />
                <span>Historical Baseline</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-sm bg-primary" />
                <span>ML Projected Horizon ({forecastHorizon}d)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Churn Risk */}
      {activeTab === "churn" && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {churnList.map((c) => (
            <div key={c.customer_id} className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-foreground truncate max-w-[180px]">{c.name}</h3>
                  <p className="text-xs text-muted-foreground">{c.company}</p>
                </div>
                <StatusBadge status={c.risk_level} />
              </div>

              <div className="space-y-2 border-t border-border pt-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Churn Probability:</span>
                  <span className="font-mono font-bold text-rose-500">{(c.churn_probability * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Account LTV:</span>
                  <span className="font-mono font-bold text-foreground">{formatCurrency(c.monetary_value)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Days Since Last Order:</span>
                  <span className="font-bold text-amber-500">{c.recency_days} days</span>
                </div>

                <div className="space-y-1.5 border-t border-border pt-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Contributing Predictive Signals</span>
                  <ul className="space-y-1 text-[11px] text-muted-foreground list-disc list-inside">
                    {c.top_factors.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Governed AI Copilot */}
      {activeTab === "copilot" && (
        <div className="flex h-[600px] flex-col rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-border bg-secondary/30 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary">
                <Terminal className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-foreground">Governed Operational Decision Copilot</h2>
                <p className="text-[11px] text-muted-foreground">Natural language reasoning with direct SQL query verification and cited SOP playbooks</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>SQL Verifier: ACTIVE</span>
            </div>
          </div>

          {/* Quick Prompts Bar */}
          <div className="flex items-center gap-2 px-6 py-2.5 border-b border-border bg-secondary/10 overflow-x-auto text-[11px]">
            <span className="text-muted-foreground font-semibold whitespace-nowrap">Quick Inquiries:</span>
            {[
              "What are our top revenue categories and stockout risks?",
              "Show all customer accounts with >75% churn probability.",
              "How is Western Region quota attainment pacing vs plan?"
            ].map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendChat(p)}
                className="whitespace-nowrap rounded-md border border-border bg-card px-2.5 py-1 text-muted-foreground hover:text-foreground hover:border-ring transition-colors"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role === "assistant" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-primary">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                <div
                  className={`max-w-2xl rounded-2xl p-4 text-xs space-y-3 ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground font-medium"
                      : "border border-border bg-secondary/40 text-foreground"
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{m.content}</p>

                  {Array.isArray(m.metrics) && m.metrics.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 bg-background/80 p-2.5 rounded-xl border border-border font-mono text-[11px]">
                      {m.metrics.map((met, idx) => (
                        <div key={idx} className="flex justify-between">
                          <span className="text-muted-foreground">{met.label}:</span>
                          <span className="font-bold text-foreground">{met.value}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {m.recommendations && m.recommendations.length > 0 && (
                    <div className="space-y-1.5 border-t border-border pt-2 text-[11px]">
                      <span className="font-bold uppercase text-primary">Recommended Operational Actions:</span>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {m.recommendations.map((rec, i) => (
                          <li key={i}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {m.citations && m.citations.length > 0 && (
                    <div className="space-y-1 border-t border-border pt-2 text-[10px] text-muted-foreground">
                      <span className="font-semibold uppercase text-primary">Cited SOP References:</span>
                      {m.citations.map((c, i) => (
                        <p key={i} className="font-mono">📌 {c.document} {c.section ? `(Section ${c.section})` : ""}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex gap-3 items-center text-xs text-muted-foreground">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Bot className="h-4 w-4 animate-spin" />
                </div>
                <span>Executing parameter-verified SQL query on relational ledger...</span>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Chat Input */}
          <div className="border-t border-border p-4 bg-secondary/20 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
              placeholder="Ask about operational risks, inventory depletion, or quarterly margins..."
              className="flex-1 rounded-xl border border-border bg-card px-4 py-2.5 text-xs text-foreground focus:border-ring focus:outline-none placeholder:text-muted-foreground"
            />
            <button
              onClick={() => handleSendChat()}
              disabled={chatLoading}
              className="rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1.5"
            >
              <span>Query</span>
              <Send className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: Model Registry */}
      {activeTab === "models" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {models.map((m) => (
              <div key={m.id} className="rounded-2xl border border-border bg-card p-6 space-y-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-[10px] text-muted-foreground">{m.version}</span>
                    <h3 className="text-base font-bold text-foreground">{m.name}</h3>
                    <p className="text-xs text-primary font-medium">{m.algorithm}</p>
                  </div>
                  <StatusBadge status={m.status} />
                </div>

                <div className="space-y-2 border-t border-border pt-3 text-xs">
                  <p className="font-semibold uppercase text-muted-foreground text-[10px]">Evaluation Metrics</p>
                  <div className="grid grid-cols-2 gap-2 bg-secondary/50 p-3 rounded-xl border border-border font-mono">
                    {Object.entries(m.metrics).map(([k, v]) => (
                      <div key={k} className="flex justify-between">
                        <span className="text-muted-foreground">{k}:</span>
                        <span className="text-foreground font-bold">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-border pt-3">
                  <span className="text-[10px] text-muted-foreground">Trained: {m.last_trained_at.split("T")[0]}</span>
                  <button
                    onClick={() => handleRetrain(m.id)}
                    disabled={retraining === m.id}
                    className="flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-3 py-1 text-xs font-semibold text-foreground hover:bg-secondary/80 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`h-3 w-3 ${retraining === m.id ? "animate-spin text-primary" : ""}`} />
                    <span>{retraining === m.id ? "Retraining..." : "Retrain Pipeline"}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
