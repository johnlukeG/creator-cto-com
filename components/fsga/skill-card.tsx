// FSGA workshop — canonical Skill teaching card.
//
// SERVER-compatible: no hooks in this file. The only interactive bit (copy
// button) is delegated to the CopyButton client component so this card can
// be rendered both from server pages (pack view) and, later, embedded inside
// presentation slides (Task 6) without extra client-boundary ceremony.

import { Pill } from "@/components/atoms";
import type { ReactNode } from "react";
import type { Skill, SkillCategory } from "@/lib/fsga/skills/types";
import { CopyButton } from "./copy-button";

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
  rank,
}: {
  skill: Skill;
  customReason?: string | null;
  recommendedFirst?: boolean;
  rank?: number;
}) {
  return (
    <div className="bg-bg-card border border-line rounded-[18px] p-5 sm:p-7">
      {/* Header row */}
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
      </div>

      {/* Custom reason */}
      {customReason && (
        <p className="text-[13px] text-accent mt-4 leading-[1.6]">
          <span className="text-ink-muted">Why this one for you:</span> {customReason}
        </p>
      )}

      {/* Workflow strip */}
      <div className="mt-5 grid gap-4">
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

      {/* Starter prompt */}
      <div className="mt-5 bg-bg-muted border border-line-soft rounded-xl p-4">
        <div className="flex items-center justify-between gap-3 mb-2.5">
          <span className="text-[10px] tracking-[0.08em] uppercase text-ink-faint">Starter prompt</span>
          <CopyButton text={skill.starterPrompt} label="copy prompt" />
        </div>
        <p className="font-mono text-[12px] text-ink-muted leading-[1.6] whitespace-pre-wrap">
          {skill.starterPrompt}
        </p>
      </div>
    </div>
  );
}
