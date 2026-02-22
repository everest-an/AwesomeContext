"use client";

import { useState } from "react";

export default function CopyBlock({
  code,
  children,
  className = "",
}: {
  code: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        // Fallback for older/blocked clipboard APIs.
        const textarea = document.createElement("textarea");
        textarea.value = code;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Keep UI responsive even if clipboard is denied.
      setCopied(false);
    }
  }

  return (
    <div className={`code-block relative group ${className}`} translate="no">
      <button
        type="button"
        onClick={copy}
        className="absolute top-2.5 right-2.5 px-2 py-1 rounded-md text-[11px] font-medium opacity-100 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100 transition-opacity bg-[var(--glass-bg)] border border-[var(--glass-border)] text-[var(--text-tertiary)] hover:text-[var(--foreground)] hover:border-[var(--accent)]"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
      {children ?? (
        <pre className="text-[var(--text-secondary)] whitespace-pre-wrap text-[13px] p-4 select-text">
          {code}
        </pre>
      )}
    </div>
  );
}
