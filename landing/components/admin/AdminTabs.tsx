"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/admin", label: "Overview", exact: true },
  { href: "/admin/users", label: "Users", exact: false },
  { href: "/admin/payments", label: "Payments", exact: false },
  { href: "/admin/logs", label: "Logs", exact: false },
];

export default function AdminTabs() {
  const pathname = usePathname();

  return (
    <div className="flex gap-1 mb-6 border-b border-[var(--glass-border)] pb-2">
      {tabs.map((tab) => {
        const active = tab.exact
          ? pathname === tab.href
          : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`px-4 py-2 rounded-t-lg text-[13px] font-medium transition-all ${
              active
                ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                : "text-[var(--text-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--glass-hover)]"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
