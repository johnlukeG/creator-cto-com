"use client";

// FSGA workshop — pack-page lead capture. Rendered between the ranked skill
// list and the "keep going" CTA block on the public pack page (pack-view.tsx),
// so attendees who land on their pack via the deck's "there's a button on
// your pack page" CTA have something to click. Mirrors the lead-capture idiom
// in starter-flow.tsx exactly (BtnButton/TextInput/Field, honeypot), but posts
// source: "pack_page" + packSlug + requestedPackCopy: true instead.

import { useState, type FormEvent } from "react";
import { BtnButton, Field, TextInput } from "./atoms";

export function PackLeadForm({ packSlug }: { packSlug: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
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
          subscribe,
          source: "pack_page",
          packSlug,
          requestedPackCopy: true,
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
      <div className="bg-bg-card border border-line rounded-[18px] p-6 text-[13px] text-accent text-center">
        Sent. Check your inbox after the event.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-bg-card border border-line rounded-[18px] p-6 grid gap-4">
      <div className="text-[13px] font-bold tracking-[-0.03em]">Email me this pack</div>

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
      <label className="flex items-center gap-2 text-[12px] text-ink-muted">
        <input type="checkbox" checked={subscribe} onChange={(e) => setSubscribe(e.target.checked)} />
        Follow Creator CTO for more AI workflow builds
      </label>

      {status === "error" && <p className="text-[12px] text-ink-faint">Something went wrong — try again.</p>}

      <BtnButton type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending…" : "Email me this pack"}
      </BtnButton>
    </form>
  );
}
