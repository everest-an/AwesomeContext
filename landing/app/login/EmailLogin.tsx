"use client";

import { useState } from "react";

export default function EmailLogin({ callbackUrl }: { callbackUrl: string }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError(null);

    try {
      const csrfRes = await fetch("/api/auth/csrf");
      const { csrfToken } = (await csrfRes.json()) as { csrfToken?: string };

      if (!csrfToken) {
        throw new Error("Missing CSRF token");
      }

      const res = await fetch("/api/auth/signin/resend", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "X-Auth-Return-Redirect": "1",
        },
        body: new URLSearchParams({
          csrfToken,
          email,
          callbackUrl,
          json: "true",
        }),
      });

      const data = (await res.json()) as { url?: string; error?: string };
      if (data.url) {
        window.location.href = data.url;
        return;
      }

      throw new Error(data.error || "No redirect URL returned");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      {error && (
        <div className="text-red-400 text-[12px] p-2 rounded bg-red-500/10 mb-3">
          {error}
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="email"
          name="email"
          placeholder="you@example.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 px-4 py-3 rounded-xl glass text-[14px] bg-transparent border border-[var(--glass-border)] focus:border-[var(--accent)] focus:outline-none placeholder:text-[var(--text-tertiary)] transition-colors"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-3 rounded-xl bg-[var(--accent)] text-white text-[14px] font-medium hover:opacity-90 transition-opacity shrink-0 disabled:opacity-60"
        >
          {loading ? "Sending..." : "Continue"}
        </button>
      </div>
    </form>
  );
}
