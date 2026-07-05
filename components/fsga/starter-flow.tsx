"use client";

// FSGA workshop — starter Skill Pack flow for attendees not in the imported
// list (or who just want to explore). Three chip-picker steps, computed
// client-side via the pure matchSkills() (no DB), then an optional lead
// capture form. Selections mirror into ?role=&company=&pain= so the result
// is shareable/restorable: landing with all params present (or just `role`)
// renders results immediately instead of replaying the wizard.

import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { matchSkills } from "@/lib/fsga/matching";
import { getSkillBySlug } from "@/lib/fsga/skills/library";
import {
  COMPANY_TYPES,
  ROLE_CATEGORIES,
  WORKFLOW_PAINS,
  type CompanyType,
  type RoleCategory,
  type WorkflowPain,
} from "@/lib/fsga/skills/types";
import type { Skill } from "@/lib/fsga/skills/types";
import { BtnButton, Field, TextInput } from "./atoms";
import { SkillCard } from "./skill-card";

const ROLE_LABELS: Record<RoleCategory, string> = {
  "executive-founder": "Executive / Founder",
  "sales-partnerships": "Sales / Partnerships",
  "marketing-content": "Marketing / Content",
  "product-ops": "Product / Ops",
  "hiring-people": "Hiring / People",
  "analyst-research": "Analyst / Research",
  other: "Other",
};

const COMPANY_LABELS: Record<CompanyType, string> = {
  "operator-platform": "Operator / Platform",
  "media-content": "Media / Content",
  "team-league": "Team / League",
  "brand-sponsor": "Brand / Sponsor",
  "agency-services": "Agency / Services",
  "data-technology": "Data / Technology",
  other: "Other",
};

const PAIN_LABELS: Record<WorkflowPain, string> = {
  research: "Research",
  "sales-prep": "Sales prep",
  content: "Content production",
  hiring: "Hiring",
  reporting: "Reporting",
  operations: "Operations",
  "customer-feedback": "Customer feedback",
  "meeting-follow-up": "Meeting follow-up",
  strategy: "Strategy",
};

function isRoleCategory(v: string | null): v is RoleCategory {
  return v !== null && (ROLE_CATEGORIES as readonly string[]).includes(v);
}
function isCompanyType(v: string | null): v is CompanyType {
  return v !== null && (COMPANY_TYPES as readonly string[]).includes(v);
}
function isWorkflowPain(v: string | null): v is WorkflowPain {
  return v !== null && (WORKFLOW_PAINS as readonly string[]).includes(v);
}

function ChipButton({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-[11px] tracking-[0.04em] uppercase font-medium border border-line text-ink-muted hover:border-accent hover:text-accent transition-colors cursor-pointer bg-transparent"
    >
      {label}
    </button>
  );
}

function StepPicker({
  step,
  total,
  title,
  children,
}: {
  step: number;
  total: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="text-[11px] text-ink-faint tracking-[0.04em] uppercase mb-2">
        Step {step} of {total}
      </div>
      <h2 className="text-[20px] font-bold tracking-tight mb-4">{title}</h2>
      <div className="flex flex-wrap gap-2.5">{children}</div>
    </div>
  );
}

export function StarterFlow() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const paramRole = searchParams.get("role");
  const paramCompany = searchParams.get("company");
  const paramPain = searchParams.get("pain");

  const initialRole = isRoleCategory(paramRole) ? paramRole : null;
  const initialCompany = isCompanyType(paramCompany) ? paramCompany : null;
  const initialPain = isWorkflowPain(paramPain) ? paramPain : null;

  // Restoring a shared/bookmarked URL: if a role is already present, skip
  // straight to results rather than replaying the wizard.
  const [step, setStep] = useState<0 | 1 | 2 | 3>(initialRole ? 3 : 0);
  const [role, setRole] = useState<RoleCategory | null>(initialRole);
  const [company, setCompany] = useState<CompanyType | null>(initialCompany);
  const [pain, setPain] = useState<WorkflowPain | null>(initialPain);

  useEffect(() => {
    const params = new URLSearchParams();
    if (role) params.set("role", role);
    if (company) params.set("company", company);
    if (pain) params.set("pain", pain);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, company, pain, pathname]);

  function handleRestart() {
    setRole(null);
    setCompany(null);
    setPain(null);
    setStep(0);
  }

  if (step === 3 && role) {
    const matches = matchSkills({ roleCategory: role, companyType: company, pain });
    const items = matches
      .map((match) => {
        const skill = getSkillBySlug(match.slug);
        return skill ? { match, skill } : null;
      })
      .filter((x): x is { match: (typeof matches)[number]; skill: Skill } => x !== null);

    return (
      <div className="max-w-[680px] mx-auto">
        <div className="flex items-center justify-between gap-3 mb-5">
          <h2 className="text-[22px] font-bold tracking-tight">Your starter Skill Pack</h2>
          <button
            type="button"
            onClick={handleRestart}
            className="text-[12px] text-ink-faint hover:text-accent transition-colors cursor-pointer bg-transparent border-0"
          >
            Start over
          </button>
        </div>

        <div className="grid gap-5">
          {items.map(({ match, skill }, index) => (
            <SkillCard
              key={skill.slug}
              skill={skill}
              customReason={match.reason}
              recommendedFirst={match.recommendedFirst}
              rank={index + 1}
            />
          ))}
        </div>

        <div className="mt-8">
          <LeadCaptureForm role={role} pain={pain} />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[560px] mx-auto grid gap-8">
      {step === 0 && (
        <StepPicker step={1} total={3} title="What's your role?">
          {ROLE_CATEGORIES.map((r) => (
            <ChipButton
              key={r}
              label={ROLE_LABELS[r]}
              onClick={() => {
                setRole(r);
                setStep(1);
              }}
            />
          ))}
        </StepPicker>
      )}

      {step === 1 && (
        <StepPicker step={2} total={3} title="What kind of company?">
          {COMPANY_TYPES.map((c) => (
            <ChipButton
              key={c}
              label={COMPANY_LABELS[c]}
              onClick={() => {
                setCompany(c);
                setStep(2);
              }}
            />
          ))}
          <ChipButton
            label="Skip"
            onClick={() => {
              setCompany(null);
              setStep(2);
            }}
          />
        </StepPicker>
      )}

      {step === 2 && (
        <StepPicker step={3} total={3} title="What's your biggest workflow pain right now?">
          {WORKFLOW_PAINS.map((p) => (
            <ChipButton
              key={p}
              label={PAIN_LABELS[p]}
              onClick={() => {
                setPain(p);
                setStep(3);
              }}
            />
          ))}
          <ChipButton
            label="Not sure"
            onClick={() => {
              setPain(null);
              setStep(3);
            }}
          />
        </StepPicker>
      )}
    </div>
  );
}

function LeadCaptureForm({ role, pain }: { role: RoleCategory; pain: WorkflowPain | null }) {
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
          role,
          workflowInterest: pain ?? undefined,
          subscribe,
          source: "starter_flow",
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
      <div className="text-[13px] font-bold tracking-tight">Want this pack emailed to you?</div>

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
        Subscribe to Creator CTO updates
      </label>

      {status === "error" && <p className="text-[12px] text-ink-faint">Something went wrong — try again.</p>}

      <BtnButton type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending…" : "Email me this pack"}
      </BtnButton>
    </form>
  );
}
