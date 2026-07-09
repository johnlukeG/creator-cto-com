"use client";

// FSGA workshop — per-card "take it with you" actions. Receives a resolved
// Skill (placeholders + any signature branding already applied by PackView).
// Copy/download are client-only and degrade to no-ops when the browser API is
// unavailable; the full prompt is also printed on the card as a manual fallback.

import { useState } from "react";
import { Btn } from "@/components/atoms";
import type { Skill } from "@/lib/fsga/skills/types";
import { buildYourOwnQuery, compileSkillFile, compileSkillPrompt } from "@/lib/fsga/skill-export";

const ACTION_CLASS =
  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] tracking-[0.02em] font-medium bg-chip text-chip-ink hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap";

export function SkillActions({ skill }: { skill: Skill }) {
  const [copied, setCopied] = useState(false);

  async function handleCopyPrompt() {
    try {
      if (!navigator?.clipboard?.writeText) return;
      await navigator.clipboard.writeText(compileSkillPrompt(skill));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard unavailable or denied — no-op.
    }
  }

  function handleDownload() {
    try {
      const blob = new Blob([compileSkillFile(skill)], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${skill.slug}.md`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      // Download unsupported — no-op; the prompt is copyable above.
    }
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button type="button" onClick={handleCopyPrompt} className={ACTION_CLASS}>
        {copied ? "copied ✓" : "copy as prompt"}
      </button>
      <button type="button" onClick={handleDownload} className={ACTION_CLASS}>
        download Skill (.md)
      </button>
      <Btn href={`/fsga/build-your-own${buildYourOwnQuery(skill)}`} variant="primary">
        Make this your Skill →
      </Btn>
    </div>
  );
}
