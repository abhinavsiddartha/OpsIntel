"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Bot,
  Send,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  FileText,
  CheckCircle,
  Clock,
  Layers,
  HelpCircle
} from "lucide-react";
import { api } from "@/lib/api";
import { AIChatMessage } from "@/types";

export default function CopilotPage() {
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      role: "assistant",
      content: "Hello! I am your OpsIntel AI Business Decision Copilot. I have real-time relational visibility across Sales orders, Inventory supply chain, Customer churn risks, and Quota targets. How can I assist you with operational intelligence today?",
      created_at: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<number | undefined>(undefined);
  const scrollRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    "What are the biggest operational risks impacting revenue this quarter?",
    "Show products currently at critical risk of inventory stockout.",
    "Which high-value enterprise accounts are flagged for churn?",
    "Explain recent anomalies detected in orders or discounting overrides.",
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: AIChatMessage = {
      role: "user",
      content: query,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setLoading(true);

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
      // Fallback
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Telemetry analysis indicates revenue is pacing at 91.5% of quarterly goal. Apex GPU Pods require emergency purchase orders (<7 days supply remaining). Outreach is recommended for 7 high-risk enterprise accounts in NA-West.",
          recommendations: [
            "Expedite supplier delivery on Apex GPU Pods (SKU-GPU-008).",
            "Initiate proactive Executive QBRs for at-risk accounts in NA-West."
          ],
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col rounded-2xl border border-zinc-800/80 bg-zinc-950/60 shadow-2xl backdrop-blur-md overflow-hidden">
      {/* Copilot Header */}
      <div className="flex items-center justify-between border-b border-zinc-800/80 bg-zinc-900/40 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-400">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">OpsIntel Business Copilot</h2>
              <span className="rounded bg-indigo-950 px-2 py-0.5 text-[10px] font-semibold text-indigo-300 border border-indigo-800/40">
                HYBRID REASONING CORE
              </span>
            </div>
            <p className="text-xs text-zinc-400">Grounded in live relational database telemetry & vector document knowledge</p>
          </div>
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((m, idx) => {
          const isUser = m.role === "user";
          return (
            <div key={idx} className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
              {!isUser && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-600/30 mt-1">
                  <Sparkles className="h-4 w-4" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-2xl p-5 space-y-3 ${
                  isUser
                    ? "bg-indigo-600 text-white font-medium"
                    : "border border-zinc-800/80 bg-zinc-900/80 text-zinc-100 backdrop-blur-sm"
                }`}
              >
                <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>

                {/* Structured Metrics Block */}
                {m.metrics && m.metrics.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 border-t border-zinc-800 pt-3">
                    {m.metrics.map((met, i) => (
                      <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-2.5 space-y-0.5">
                        <span className="text-[10px] uppercase font-semibold text-zinc-400">{met.label}</span>
                        <p className="text-xs font-bold text-white font-mono">{met.value}</p>
                        <span className="text-[10px] text-indigo-400 font-medium">{met.status}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Structured Recommendations Block */}
                {m.recommendations && m.recommendations.length > 0 && (
                  <div className="rounded-xl border border-indigo-900/40 bg-indigo-950/20 p-3.5 space-y-1.5 border-t border-zinc-800">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                      <CheckCircle className="h-3.5 w-3.5" /> Actionable Recommendations
                    </span>
                    <ul className="space-y-1 text-xs text-zinc-300 list-disc list-inside">
                      {m.recommendations.map((rec, i) => (
                        <li key={i}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Structured Citations Block */}
                {m.citations && m.citations.length > 0 && (
                  <div className="space-y-1 border-t border-zinc-800 pt-2 text-[11px] text-zinc-400">
                    <span className="font-semibold uppercase text-zinc-500 text-[10px] flex items-center gap-1">
                      <FileText className="h-3 w-3" /> Grounding RAG Citations
                    </span>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {m.citations.map((c, i) => (
                        <span key={i} className="rounded-md border border-zinc-800 bg-zinc-950 px-2 py-0.5 text-zinc-300 font-mono text-[10px]">
                          {c.document} {c.section ? `• ${c.section}` : ""}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-3 text-zinc-400 text-xs">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white animate-pulse">
              <Sparkles className="h-4 w-4" />
            </div>
            <span>Analyzing relational business metrics & retrieving evidence...</span>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="border-t border-zinc-800/80 bg-zinc-900/40 px-6 py-2.5 flex items-center gap-2 overflow-x-auto">
        <span className="text-[10px] font-semibold uppercase text-zinc-500 shrink-0">Try:</span>
        {suggestedPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p)}
            className="rounded-lg border border-zinc-800 bg-zinc-950/80 px-2.5 py-1 text-[11px] text-zinc-300 whitespace-nowrap hover:border-indigo-500 hover:text-white transition-colors"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="border-t border-zinc-800/80 bg-zinc-950 p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about sales, supply chain risks, customer churn, or targets..."
            className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900/80 px-4 py-3 text-xs sm:text-sm text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 disabled:opacity-40 transition-all"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
