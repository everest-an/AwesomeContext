"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Payment = {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: string;
  method: string | null;
  note: string | null;
  createdAt: string;
  user: { id: string; name: string | null; email: string; image: string | null };
};

type UserOption = { id: string; name: string | null; email: string };

export default function PaymentManager({
  payments,
  users,
  totalRevenue,
}: {
  payments: Payment[];
  users: UserOption[];
  totalRevenue: number;
}) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    userId: "",
    amount: "",
    currency: "USD",
    method: "manual",
    note: "",
  });

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/admin/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: form.userId,
        amount: Math.round(parseFloat(form.amount) * 100),
        currency: form.currency,
        method: form.method,
        note: form.note || undefined,
      }),
    });
    setSaving(false);
    setShowForm(false);
    setForm({ userId: "", amount: "", currency: "USD", method: "manual", note: "" });
    router.refresh();
  }

  async function handleStatusChange(id: string, status: string) {
    await fetch(`/api/admin/payments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this payment record?")) return;
    await fetch(`/api/admin/payments/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <>
      {/* Summary */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[13px] text-[var(--text-tertiary)]">
            Total Revenue:{" "}
          </span>
          <span className="text-lg font-bold">
            ${(totalRevenue / 100).toFixed(2)}
          </span>
          <span className="text-[13px] text-[var(--text-tertiary)] ml-4">
            {payments.length} records
          </span>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-[13px] font-medium hover:opacity-90 transition-opacity"
        >
          {showForm ? "Cancel" : "Record Payment"}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <form
          onSubmit={handleCreate}
          className="glass-card rounded-xl p-4 mb-4 grid grid-cols-1 md:grid-cols-5 gap-3 items-end"
        >
          <div>
            <label className="text-[11px] text-[var(--text-tertiary)] uppercase tracking-wide block mb-1">
              User
            </label>
            <select
              required
              value={form.userId}
              onChange={(e) => setForm({ ...form, userId: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[13px]"
            >
              <option value="">Select user...</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name ?? u.email}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[11px] text-[var(--text-tertiary)] uppercase tracking-wide block mb-1">
              Amount ($)
            </label>
            <input
              required
              type="number"
              step="0.01"
              min="0.01"
              placeholder="9.99"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[13px]"
            />
          </div>
          <div>
            <label className="text-[11px] text-[var(--text-tertiary)] uppercase tracking-wide block mb-1">
              Method
            </label>
            <select
              value={form.method}
              onChange={(e) => setForm({ ...form, method: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[13px]"
            >
              <option value="manual">Manual</option>
              <option value="transfer">Transfer</option>
              <option value="wechat">WeChat</option>
              <option value="alipay">Alipay</option>
            </select>
          </div>
          <div>
            <label className="text-[11px] text-[var(--text-tertiary)] uppercase tracking-wide block mb-1">
              Note
            </label>
            <input
              type="text"
              placeholder="Optional note"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[13px]"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-[13px] font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </form>
      )}

      {/* Payments table */}
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="text-left text-[var(--text-tertiary)] uppercase text-[11px] tracking-wide">
              <th className="pb-3">User</th>
              <th className="pb-3">Amount</th>
              <th className="pb-3">Method</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Note</th>
              <th className="pb-3">Date</th>
              <th className="pb-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--glass-border)]">
            {payments.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="py-6 text-center text-[var(--text-tertiary)]"
                >
                  No payment records yet.
                </td>
              </tr>
            ) : (
              payments.map((p) => (
                <tr key={p.id}>
                  <td className="py-3 flex items-center gap-2">
                    {p.user.image && (
                      <img
                        src={p.user.image}
                        alt=""
                        className="w-5 h-5 rounded-full"
                      />
                    )}
                    {p.user.name ?? p.user.email}
                  </td>
                  <td className="py-3 font-medium">
                    ${(p.amount / 100).toFixed(2)} {p.currency}
                  </td>
                  <td className="py-3 text-[var(--text-secondary)]">
                    {p.method ?? "—"}
                  </td>
                  <td className="py-3">
                    <select
                      value={p.status}
                      onChange={(e) =>
                        handleStatusChange(p.id, e.target.value)
                      }
                      className={`px-2 py-0.5 rounded-full text-[11px] font-medium border-0 ${
                        p.status === "completed"
                          ? "bg-green-500/20 text-green-400"
                          : p.status === "refunded"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      <option value="completed">completed</option>
                      <option value="pending">pending</option>
                      <option value="refunded">refunded</option>
                    </select>
                  </td>
                  <td className="py-3 text-[var(--text-tertiary)] max-w-[200px] truncate">
                    {p.note ?? "—"}
                  </td>
                  <td className="py-3 text-[var(--text-tertiary)]">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3">
                    <button
                      type="button"
                      onClick={() => handleDelete(p.id)}
                      className="text-red-400 hover:text-red-300 text-[12px]"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
