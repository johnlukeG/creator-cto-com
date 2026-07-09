"use client";

// FSGA workshop — "build your first Skill" sentence exercise. The live
// sentence is the pedagogical point: attendees see their own workflow
// collapse into the turn-X-into-Y-so-that-Z shape a Skill formalizes.
//
// "Draft my Skill with AI" always succeeds from the attendee's point of
// view: it posts to /api/fsga/generate-skill (which itself never 5xxs and
// degrades to a template draft under cap/rate-limit/AI failure), and if the
// request itself can't even complete (offline, DNS, etc.) this component
// falls back to the same pure templateSkillIdea() the server uses — so the
// draft never depends on network reachability being perfect.

import { useEffect, useState } from "react";
import { Pill } from "@/components/atoms";
import type { SkillIdea } from "@/lib/fsga/skill-idea";
import { templateSkillIdea } from "@/lib/fsga/template-fallback";
import { BtnButton, Field, TextArea, TextInput } from "./atoms";

interface BuildSkillFormState {
  repeatedTask: string;
  inputType: string;
  outputType: string;
  successGoal: string;
}

const EMPTY_STATE: BuildSkillFormState = {
  repeatedTask: "",
  inputType: "",
  outputType: "",
  successGoal: "",
};

export function BuildSkillForm({
  onDraftWithAi,
}: {
  onDraftWithAi?: (state: BuildSkillFormState) => void;
}) {
  const [form, setForm] = useState<BuildSkillFormState>(EMPTY_STATE);

  // Prefill from a deep link (?task=&input=&output=&goal=) — the scorecard's
  // "Name it" hand-off and the pack page's "Make this your Skill" CTA both use
  // this. After hydration only; never clobbers what the attendee has typed.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const task = params.get("task");
    const input = params.get("input");
    const output = params.get("output");
    const goal = params.get("goal");
    if (!task && !input && !output && !goal) return;
    setForm((f) => ({
      repeatedTask: f.repeatedTask || (task ?? "").slice(0, 300),
      inputType: f.inputType || (input ?? "").slice(0, 300),
      outputType: f.outputType || (output ?? "").slice(0, 300),
      successGoal: f.successGoal || (goal ?? "").slice(0, 300),
    }));
  }, []);

  const hasAnyContent = Object.values(form).some((v) => v.trim().length > 0);
  const allFieldsFilled = Object.values(form).every((v) => v.trim().length > 0);

  const [draftStatus, setDraftStatus] = useState<"idle" | "drafting" | "done">("idle");
  const [draft, setDraft] = useState<SkillIdea | null>(null);
  const [draftSource, setDraftSource] = useState<"ai" | "template" | null>(null);

  function update<K extends keyof BuildSkillFormState>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleDraftWithAi() {
    if (!allFieldsFilled || draftStatus === "drafting") return;
    onDraftWithAi?.(form);
    setDraftStatus("drafting");

    try {
      const res = await fetch("/api/fsga/generate-skill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.idea) throw new Error("generate-skill request failed");
      setDraft(data.idea as SkillIdea);
      setDraftSource(data.source === "ai" ? "ai" : "template");
    } catch {
      // Request itself failed (offline, timeout, non-JSON) — fall back to
      // the same pure template function the server uses, so the attendee
      // still leaves with a draft no matter what.
      setDraft(templateSkillIdea(form));
      setDraftSource("template");
    } finally {
      setDraftStatus("done");
    }
  }

  return (
    <div className="max-w-[560px] mx-auto grid gap-6">
      <div className="grid gap-4">
        <Field label="Repeated task">
          <TextInput
            value={form.repeatedTask}
            onChange={(e) => update("repeatedTask", e.target.value)}
            placeholder="e.g. writing the weekly pipeline summary"
            maxLength={300}
          />
        </Field>
        <Field label="Input type">
          <TextInput
            value={form.inputType}
            onChange={(e) => update("inputType", e.target.value)}
            placeholder="e.g. a raw CRM export"
            maxLength={300}
          />
        </Field>
        <Field label="Output type">
          <TextInput
            value={form.outputType}
            onChange={(e) => update("outputType", e.target.value)}
            placeholder="e.g. a clean weekly summary"
            maxLength={300}
          />
        </Field>
        <Field label="Success goal">
          <TextArea
            value={form.successGoal}
            onChange={(e) => update("successGoal", e.target.value)}
            placeholder="e.g. leadership reads it without follow-up questions"
            rows={2}
            maxLength={300}
          />
        </Field>
      </div>

      {hasAnyContent && (
        <div className="bg-bg-muted border border-line-soft rounded-xl p-4 text-[14px] leading-[1.6]">
          My first Skill should help me turn{" "}
          <span className={form.inputType ? "text-accent font-medium" : "text-ink-faint"}>
            {form.inputType || "[input]"}
          </span>{" "}
          into{" "}
          <span className={form.outputType ? "text-accent font-medium" : "text-ink-faint"}>
            {form.outputType || "[output]"}
          </span>{" "}
          so that{" "}
          <span className={form.successGoal ? "text-accent font-medium" : "text-ink-faint"}>
            {form.successGoal || "[success goal]"}
          </span>
          .
        </div>
      )}

      <div className="flex items-center gap-3 flex-wrap">
        <BtnButton
          type="button"
          disabled={!allFieldsFilled || draftStatus === "drafting"}
          onClick={handleDraftWithAi}
        >
          {draftStatus === "drafting" ? "Drafting…" : "Draft my Skill with AI"}
        </BtnButton>
      </div>

      {draft && <SkillDraftCard idea={draft} source={draftSource ?? "template"} />}
    </div>
  );
}

// Mini card idiom borrowed from SkillCard (components/fsga/skill-card.tsx)
// but deliberately not that component — this renders a single ad hoc draft,
// not a catalog Skill with category/difficulty/starter-prompt metadata.
function SkillDraftCard({ idea, source }: { idea: SkillIdea; source: "ai" | "template" }) {
  return (
    <div className="bg-bg-card border border-line rounded-[18px] p-5 grid gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <h4 className="font-bold tracking-[-0.03em] text-[16px] leading-tight mr-auto">{idea.skill_name}</h4>
        <Pill variant={source === "ai" ? "accent" : "outline"}>
          {source === "ai" ? "drafted by AI" : "template draft"}
        </Pill>
      </div>

      <p className="text-[13px] text-ink-muted leading-[1.6]">{idea.description}</p>

      <DraftSection label="Inputs" items={idea.inputs} ordered={false} />
      <DraftSection label="Process" items={idea.process_steps} ordered />
      <DraftSection label="Outputs" items={idea.outputs} ordered={false} />
    </div>
  );
}

function DraftSection({ label, items, ordered }: { label: string; items: string[]; ordered: boolean }) {
  const ListTag = ordered ? "ol" : "ul";
  return (
    <div>
      <div className="text-[10px] tracking-[0.08em] uppercase text-ink-faint mb-1.5">{label}</div>
      <ListTag className={`${ordered ? "list-decimal" : "list-disc"} pl-4 grid gap-1 text-[13px] text-ink-muted leading-[1.6]`}>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ListTag>
    </div>
  );
}
