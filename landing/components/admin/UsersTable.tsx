"use client";

import { useState } from "react";

type UserRow = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
  source: string | null;
  country: string | null;
  city: string | null;
  provider: string | null;
  calls30d: number;
  revenue: number;
  createdAt: string;
  _count: { apiKeys: number; payments: number };
};

export default function UsersTable({ users }: { users: UserRow[] }) {
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");

  const countries = [
    ...new Set(users.map((u) => u.country).filter(Boolean)),
  ] as string[];
  const sources = [
    ...new Set(users.map((u) => u.provider).filter(Boolean)),
  ] as string[];

  const filtered = users.filter((u) => {
    if (
      search &&
      !u.name?.toLowerCase().includes(search.toLowerCase()) &&
      !u.email.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    if (countryFilter && u.country !== countryFilter) return false;
    if (sourceFilter && u.provider !== sourceFilter) return false;
    return true;
  });

  return (
    <>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <input
          type="text"
          placeholder="Search name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[13px] w-64 focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
        />
        <select
          value={countryFilter}
          onChange={(e) => setCountryFilter(e.target.value)}
          className="px-3 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[13px] focus:outline-none"
        >
          <option value="">All Countries</option>
          {countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          className="px-3 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[13px] focus:outline-none"
        >
          <option value="">All Sources</option>
          {sources.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <span className="text-[12px] text-[var(--text-tertiary)] self-center">
          {filtered.length} users
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="text-left text-[var(--text-tertiary)] uppercase text-[11px] tracking-wide">
              <th className="pb-3">User</th>
              <th className="pb-3">Email</th>
              <th className="pb-3">Role</th>
              <th className="pb-3">Source</th>
              <th className="pb-3">Country</th>
              <th className="pb-3">Keys</th>
              <th className="pb-3">Calls (30d)</th>
              <th className="pb-3">Revenue</th>
              <th className="pb-3">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--glass-border)]">
            {filtered.map((user) => (
              <tr key={user.id}>
                <td className="py-3 flex items-center gap-2">
                  {user.image && (
                    <img
                      src={user.image}
                      alt=""
                      className="w-6 h-6 rounded-full"
                    />
                  )}
                  {user.name ?? "—"}
                </td>
                <td className="py-3 text-[var(--text-secondary)]">
                  {user.email}
                </td>
                <td className="py-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                      user.role === "admin"
                        ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                        : "bg-[rgba(255,255,255,0.06)] text-[var(--text-secondary)]"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="py-3 text-[var(--text-secondary)]">
                  {user.source ?? user.provider ?? "—"}
                </td>
                <td className="py-3 text-[var(--text-secondary)]">
                  {user.country
                    ? `${user.country}${user.city ? ` / ${user.city}` : ""}`
                    : "—"}
                </td>
                <td className="py-3">{user._count.apiKeys}</td>
                <td className="py-3">{user.calls30d}</td>
                <td className="py-3">
                  {user.revenue > 0
                    ? `$${(user.revenue / 100).toFixed(2)}`
                    : "—"}
                </td>
                <td className="py-3 text-[var(--text-tertiary)]">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
