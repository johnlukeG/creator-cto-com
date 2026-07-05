"use client";

// FSGA workshop — "build your first Skill" sentence exercise. The live
// sentence is the pedagogical point: attendees see their own workflow
// collapse into the turn-X-into-Y-so-that-Z shape a Skill formalizes.
//
// The AI draft button is intentionally inert here — Task 7 wires it to the
// generate-skill endpoint. Keep the handler shape ready (onDraftWithAi prop)
// so that wiring is additive, not a rewrite.

import { useState, type FormEvent } from "react";
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
  const hasAnyContent = Object.values(form).some((v) => v.trim().length > 0);

  function update<K extends keyof BuildSkillFormState>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  return (
    <div className="max-w-[560px] mx-auto grid gap-6">
      <div className="grid gap-4">
        <Field label="Repeated task">
          <TextInput
            value={form.repeatedTask}
            onChange={(e) => update("repeatedTask", e.target.value)}
            placeholder="e.g. writing the weekly pipeline summary"
          />
        </Field>
        <Field label="Input type">
          <TextInput
            value={form.inputType}
            onChange={(e) => update("inputType", e.target.value)}
            placeholder="e.g. a raw CRM export"
          />
        </Field>
        <Field label="Output type">
          <TextInput
            value={form.outputType}
            onChange={(e) => update("outputType", e.target.value)}
            placeholder="e.g. a clean weekly summary"
          />
        </Field>
        <Field label="Success goal">
          <TextArea
            value={form.successGoal}
            onChange={(e) => update("successGoal", e.target.value)}
            placeholder="e.g. leadership reads it without follow-up questions"
            rows={2}
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
        {/* TODO(Task 7): wire onClick to the AI generate-skill endpoint once it exists. */}
        <BtnButton type="button" disabled onClick={() => onDraftWithAi?.(form)}>
          Draft my Skill with AI
        </BtnButton>
        <span className="text-[11px] text-ink-faint">(coming at the live workshop)</span>
      </div>

      <LeadCaptureSection formState={form} />
    </div>
  );
}

function LeadCaptureSection({ formState }: { formState: BuildSkillFormState }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [workflowInterest, setWorkflowInterest] = useState(formState.repeatedTask);
  const [subscribe, setSubscribe] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<"idle" | "submitting" | "sent" | "error">("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/fsga/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          company: company || undefined,
          role: role || undefined,
          workflowInterest: workflowInterest || undefined,
          subscribe,
          requestedPackCopy: true,
          source: "build_form",
          website,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) throw new Error("lead submit failed");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="bg-bg-card border border-line rounded-xl p-5 text-[13px] text-accent text-center">
        Sent — check your inbox after the event.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-bg-card border border-line rounded-[18px] p-6 grid gap-4">
      <div className="text-[13px] font-bold tracking-[-0.03em]">Email me my Skill Pack + worksheet</div>

      {/* Honeypot — visually hidden, never shown to real attendees. */}
      <input
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] w-px h-px overflow-hidden opacity-0"
      />

      <Field label="Name">
        <TextInput value={name} onChange={(e) => setName(e.target.value)} required />
      </Field>
      <Field label="Email">
        <TextInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </Field>
      <Field label="Company (optional)">
        <TextInput value={company} onChange={(e) => setCompany(e.target.value)} />
      </Field>
      <Field label="Role (optional)">
        <TextInput value={role} onChange={(e) => setRole(e.target.value)} />
      </Field>
      <Field label="Workflow interest (optional)">
        <TextInput value={workflowInterest} onChange={(e) => setWorkflowInterest(e.target.value)} />
      </Field>
      <label className="flex items-center gap-2 text-[12px] text-ink-muted">
        <input type="checkbox" checked={subscribe} onChange={(e) => setSubscribe(e.target.checked)} />
        Subscribe to Creator CTO updates
      </label>

      {status === "error" && <p className="text-[12px] text-ink-faint">Something went wrong — try again.</p>}

      <BtnButton type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending…" : "Send my Skill Pack"}
      </BtnButton>
    </form>
  );
}
