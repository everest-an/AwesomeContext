"use client";

import { useState, useEffect, useCallback } from "react";

type LogEntry = {
  id: string;
  level: string;
  source: string;
  message: string;
  meta: string | null;
  userId: string | null;
  createdAt: string;
  user: { name: string | null; email: string } | null;
};

export default function LogViewer({
  initialLogs,
  initialTotal,
}: {
  initialLogs: LogEntry[];
  initialTotal: number;
}) {
  const [logs, setLogs] = useState(initialLogs);
  const [total, setTotal] = useState(initialTotal);
  const [level, setLevel] = useState("");
  const [source, setSource] = useState("");
  const [search, setSearch] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const fetchLogs = useCallback(
    async (append = false) => {
      setLoading(true);
      const params = new URLSearchParams();
      if (level) params.set("level", level);
      if (source) params.set("source", source);
      if (search) params.set("search", search);
      params.set("limit", "50");
      if (append) params.set("offset", String(logs.length));

      const res = await fetch(`/api/admin/logs?${params}`);
      const data = await res.json();

      if (append) {
        setLogs((prev) => [...prev, ...data.logs]);
      } else {
        setLogs(data.logs);
      }
      setTotal(data.total);
      setLoading(false);
    },
    [level, source, search, logs.length],
  );

  // Filter change triggers fresh fetch
  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level, source]);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => fetchLogs(), 10000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchLogs]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    fetchLogs();
  }

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const levelColor: Record<string, string> = {
    info: "bg-blue-500/20 text-blue-400",
    warn: "bg-yellow-500/20 text-yellow-400",
    error: "bg-red-500/20 text-red-400",
  };

  return (
    <>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="px-3 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[13px]"
        >
          <option value="">All Levels</option>
          <option value="info">Info</option>
          <option value="warn">Warn</option>
          <option value="error">Error</option>
        </select>
        <select
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="px-3 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[13px]"
        >
          <option value="">All Sources</option>
          <option value="auth">Auth</option>
          <option value="api">API</option>
          <option value="mcp">MCP</option>
          <option value="system">System</option>
        </select>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Search messages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[13px] w-56 focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
          />
          <button
            type="submit"
            className="px-3 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[13px] hover:bg-[var(--glass-hover)]"
          >
            Search
          </button>
        </form>
        <label className="flex items-center gap-2 text-[13px] text-[var(--text-secondary)] cursor-pointer ml-auto">
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
            className="rounded"
          />
          Auto-refresh (10s)
        </label>
        <span className="text-[12px] text-[var(--text-tertiary)]">
          {total} total
        </span>
      </div>

      {/* Log entries */}
      <div className="space-y-1">
        {logs.length === 0 ? (
          <p className="text-[13px] text-[var(--text-tertiary)] py-6 text-center">
            No logs found.
          </p>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="glass-card rounded-lg p-3 cursor-pointer hover:bg-[var(--glass-hover)] transition-all"
              onClick={() => toggleExpand(log.id)}
            >
              <div className="flex items-center gap-3 text-[13px]">
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                    levelColor[log.level] ?? "bg-gray-500/20 text-gray-400"
                  }`}
                >
                  {log.level}
                </span>
                <span className="text-[var(--text-tertiary)] text-[11px] font-mono">
                  {log.source}
                </span>
                <span className="flex-1 truncate">{log.message}</span>
                <span className="text-[var(--text-tertiary)] text-[11px] whitespace-nowrap">
                  {log.user?.name ?? log.user?.email ?? "—"}
                </span>
                <span className="text-[var(--text-tertiary)] text-[11px] whitespace-nowrap">
                  {new Date(log.createdAt).toLocaleString()}
                </span>
              </div>
              {expanded.has(log.id) && log.meta && (
                <pre className="mt-2 p-2 rounded bg-[rgba(0,0,0,0.3)] text-[11px] font-mono text-[var(--text-secondary)] overflow-x-auto whitespace-pre-wrap">
                  {JSON.stringify(JSON.parse(log.meta), null, 2)}
                </pre>
              )}
            </div>
          ))
        )}
      </div>

      {/* Load more */}
      {logs.length < total && (
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={() => fetchLogs(true)}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[13px] hover:bg-[var(--glass-hover)] disabled:opacity-50"
          >
            {loading ? "Loading..." : `Load More (${total - logs.length} remaining)`}
          </button>
        </div>
      )}
    </>
  );
}
