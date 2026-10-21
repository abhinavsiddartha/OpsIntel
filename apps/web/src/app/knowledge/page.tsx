"use client";

import React, { useEffect, useState } from "react";
import { BookOpen, Search, Upload, FileText, CheckCircle2, Layers } from "lucide-react";
import { api } from "@/lib/api";
import { DocumentItem } from "@/types";
import { formatDate } from "@/lib/utils";

export default function KnowledgePage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadDocuments = async () => {
    try {
      const res = await api.getDocuments();
      if (res?.data) setDocuments(res.data);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const res = await api.searchRag(searchQuery);
      if (res?.data) setSearchResults(res.data);
    } catch {
      // Fallback
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">RAG Knowledge Base & Vector Index</h1>
          <p className="text-xs text-zinc-400">Organizational manuals, sales governance policies, and operational playbooks indexed for semantic retrieval</p>
        </div>
      </div>

      {/* Search Vector Store */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-indigo-400" />
          <h2 className="text-sm font-bold text-white">Vector Similarity Search Tester</h2>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search operational protocols, safety stock rules, discount approvals..."
            className="flex-1 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={searching}
            className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 disabled:opacity-50"
          >
            {searching ? "Searching..." : "Execute Query"}
          </button>
        </form>

        {searchResults.length > 0 && (
          <div className="space-y-3 pt-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Top Ranked Retrieved Document Chunks
            </span>
            <div className="space-y-2">
              {searchResults.map((r, idx) => (
                <div key={idx} className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-4 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-indigo-400">{r.document_title}</span>
                    <span className="rounded bg-zinc-800 px-2 py-0.5 text-[10px] font-mono text-emerald-400">
                      Score: {(r.similarity_score * 100).toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">{r.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Indexed Documents Table */}
      <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white">Indexed Knowledge Base Documents</h2>
          <span className="rounded-full bg-zinc-800 px-3 py-1 text-xs font-semibold text-zinc-300">
            {documents.length} Documents Active
          </span>
        </div>

        <div className="divide-y divide-zinc-800/60 text-xs">
          {loading ? (
            <div className="py-8 text-center text-zinc-500">Loading vector repository...</div>
          ) : (
            documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between py-4 hover:bg-zinc-800/20 px-2 rounded-xl transition-colors">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-950/80 border border-indigo-800/60 text-indigo-400">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-bold text-white">{doc.title}</p>
                    <p className="text-[11px] font-mono text-zinc-500">{doc.filename} • {doc.category}</p>
                  </div>
                </div>
                <div className="text-right text-[11px]">
                  <p className="font-bold text-zinc-200">{doc.chunk_count} Indexed Chunks</p>
                  <p className="text-zinc-500">{formatDate(doc.created_at)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
