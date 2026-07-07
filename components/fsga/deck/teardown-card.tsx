// FSGA workshop — deck slide's projection-scale skill teardown (act 4
// "teardown" slide).
//
// NOT the embedded SkillCard: that component is web-scale (10-19px type,
// ~8-16px once fit-scaled onto the stage) and unreadable from a ballroom.
// This renders the SAME Skill object (no copy duplication) as slide-native
// chrome: a spec-sheet card — the five canonical sections in reading order
// (Repeated work → Input → Process → Output → Result) as divided rows with
// a fixed label rail, one input/step per line at 28px stage type. A
// 3-column I→P→O arrow flow was tried first and measured out: at 28px in
// the deck's mono face, the Process column alone needs ~400px of the ~314px
// the row gets once the Repeated-work bar, Result bar, and prompt chip take
// their share. The starter prompt is deliberately NOT rendered in full (a
// paragraph of 12px-equivalent prompt text can't be projected); the last
// row is a one-line affordance pointing the room at their pack page.
// Server-compatible (no hooks) so both the presenter and static routes can
// SSR it, same as pack-slide-card.tsx.

import type { ReactNode } from "react";
import type { Skill } from "@/lib/fsga/skills/types";

function Row({
  label,
  accent = false,
  children,
}: {
  label: string;
  accent?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`grid grid-cols-[300px_minmax(0,1fr)] gap-x-8 px-8 py-2 items-baseline ${
        accent ? "bg-accent/10" : ""
      }`}
    >
      <div className="text-[28px] tracking-[0.06em] uppercase text-accent font-bold leading-[1.2]">
        {label}
      </div>
      <div>{children}</div>
    </div>
  );
}

function Lines({ items, numbered = false }: { items: string[]; numbered?: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      {items.map((item, i) => (
        <div key={item} className="flex gap-3 text-[28px] leading-[1.2] text-ink">
          <span className="text-accent font-bold shrink-0" aria-hidden>
            {numbered ? `${i + 1}.` : "•"}
          </span>
          {item}
        </div>
      ))}
    </div>
  );
}

export function TeardownCard({ skill }: { skill: Skill }) {
  return (
    <div className="bg-bg-card border border-line rounded-[18px] divide-y divide-line-soft overflow-hidden h-full min-h-0 flex flex-col justify-center">
      <Row label="Repeated work">
        <p className="text-[28px] leading-[1.2] text-ink">{skill.repeatedWork}</p>
      </Row>
      <Row label="Input">
        <Lines items={skill.inputs} />
      </Row>
      <Row label="Process">
        <Lines items={skill.processSteps} numbered />
      </Row>
      <Row label="Output">
        <Lines items={skill.outputs} />
      </Row>
      <Row label="Result" accent>
        <p className="text-[28px] leading-[1.2] text-ink">{skill.exampleUseCase}</p>
      </Row>
      <Row label="Starter prompt">
        <p className="text-[24px] leading-[1.2] text-ink-muted">
          Included with your pack — copy it from your pack page.
        </p>
      </Row>
    </div>
  );
}
