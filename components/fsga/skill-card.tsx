// FSGA workshop — canonical Skill teaching card.
//
// SERVER-compatible: no hooks in this file. The card is a native <details>
// so it collapses to a scannable peek (name + "why for you") and expands to
// the full workflow + starter prompt on tap — zero JS, stays static/SSG. The
// interactive bits (copy prompt, download Skill .md, build-your-own link) are
// delegated to the SkillActions client component, which lives inside the
// expanded body so this card renders from server pages without extra
// client-boundary ceremony.

import { Pill } from "@/components/atoms";
import type { ReactNode } from "react";
import type { Skill, SkillCategory } from "@/lib/fsga/skills/types";
import { SkillActions } from "./skill-actions";

const CATEGORY_LABELS: Record<SkillCategory, string> = {
  "executive-founder": "Executive / Founder",
  "sales-partnerships": "Sales / Partnerships",
  "marketing-content": "Marketing / Content",
  "product-ops": "Product / Ops",
  "hiring-people": "Hiring / People",
  "personal-productivity": "Personal Productivity",
};

const DIFFICULTY_LABELS: Record<Skill["difficulty"], string> = {
  starter: "Starter",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

function WorkflowStep({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="border-l-2 border-line-soft pl-3.5">
      <div className="text-[10px] tracking-[0.08em] uppercase text-ink-faint mb-1.5">{label}</div>
      <div className="text-[13px] text-ink-muted leading-[1.6]">{children}</div>
    </div>
  );
}

export function SkillCard({
  skill,
  customReason,
  recommendedFirst = false,
  isSignature = false,
  rank,
}: {
  skill: Skill;
  customReason?: string | null;
  recommendedFirst?: boolean;
  isSignature?: boolean;
  rank?: number;
}) {
  // The signature hero and the #1 pick open by default; the rest collapse to
  // a peek. `open` is emitted once into static HTML — native <details> then
  // toggles client-side on its own (this server component ships no runtime).
  const defaultOpen = recommendedFirst || isSignature;

  return (
    <details
      {...(defaultOpen ? { open: true } : {})}
      className={`group bg-bg-card border rounded-[18px] ${isSignature ? "border-accent" : "border-line"}`}
    >
      {/* Peek — always visible; the whole summary is the toggle */}
      <summary className="list-none [&::-webkit-details-marker]:hidden cursor-pointer select-none p-5 sm:p-7 rounded-[18px]">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              {typeof rank === "number" && (
                <span className="text-[11px] text-ink-faint font-mono shrink-0">#{rank}</span>
              )}
              <h3 className="font-bold tracking-[-0.03em] text-[18px] sm:text-[19px] leading-tight mr-auto">
                {skill.name}
              </h3>
              <Pill variant="outline">{CATEGORY_LABELS[skill.category]}</Pill>
              <Pill variant="chip">{DIFFICULTY_LABELS[skill.difficulty]}</Pill>
              {skill.riskLevel === "medium" && <Pill variant="outline">human review</Pill>}
              {recommendedFirst && <Pill variant="accent">start here</Pill>}
              {isSignature && <Pill variant="accent">your signature Skill</Pill>}
            </div>

            {customReason && (
              <p className="text-[13px] text-accent mt-4 leading-[1.6]">
                <span className="text-ink-muted">Why this one for you:</span> {customReason}
              </p>
            )}
          </div>

          {/* Chevron: points right when collapsed, rotates down when open */}
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="w-4 h-4 shrink-0 mt-1 text-ink-faint transition-transform duration-200 group-open:rotate-90"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 6l6 6-6 6" />
          </svg>
        </div>
      </summary>

      {/* Expanded body */}
      <div className="px-5 sm:px-7 pb-5 sm:pb-7">
        {/* Workflow strip */}
        <div className="grid gap-4 border-t border-line-soft pt-5">
          <WorkflowStep label="Repeated work">{skill.repeatedWork}</WorkflowStep>

          <WorkflowStep label="Input">
            <ul className="list-disc pl-4 grid gap-1">
              {skill.inputs.map((input) => (
                <li key={input}>{input}</li>
              ))}
            </ul>
          </WorkflowStep>

          <WorkflowStep label="Process">
            <ol className="list-decimal pl-4 grid gap-1">
              {skill.processSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </WorkflowStep>

          <WorkflowStep label="Output">
            <ul className="list-disc pl-4 grid gap-1">
              {skill.outputs.map((output) => (
                <li key={output}>{output}</li>
              ))}
            </ul>
          </WorkflowStep>

          <WorkflowStep label="Result">{skill.exampleUseCase}</WorkflowStep>
        </div>

        {/* Starter prompt + take-it-with-you actions */}
        <div className="mt-5 bg-bg-muted border border-line-soft rounded-xl p-4">
          <div className="text-[10px] tracking-[0.08em] uppercase text-ink-faint mb-2.5">Starter prompt</div>
          <p className="font-mono text-[12px] text-ink-muted leading-[1.6] whitespace-pre-wrap">
            {skill.starterPrompt}
          </p>
          <div className="mt-4 pt-4 border-t border-line-soft">
            <SkillActions skill={skill} />
          </div>
        </div>
      </div>
    </details>
  );
}
