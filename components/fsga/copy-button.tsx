"use client";

// Small clipboard-copy control used inside SkillCard's starter-prompt block.
// Graceful no-op when the Clipboard API is unavailable (non-secure context,
// older browser, permission denied) — never throws to the caller.

import { useState } from "react";

export function CopyButton({ text, label = "copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      if (!navigator?.clipboard?.writeText) return;
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard unavailable or permission denied — no-op.
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] tracking-[0.02em] font-medium bg-chip text-chip-ink hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
    >
      {copied ? "copied ✓" : label}
    </button>
  );
}
