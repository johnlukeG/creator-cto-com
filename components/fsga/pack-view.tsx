// FSGA workshop — full public pack page body: header + ranked SkillCards + CTAs.

import { Btn, Pill } from "@/components/atoms";
import { LINKS } from "@/lib/content";
import { buildYourOwnQuery, fillPlaceholders } from "@/lib/fsga/skill-export";
import { getSkillBySlug } from "@/lib/fsga/skills/library";
import type { Skill } from "@/lib/fsga/skills/types";
import type { PublicPack, PublicPackItem } from "@/lib/fsga/db/queries";
import { PackHeader } from "./pack-header";
import { ScorecardInteractive } from "./scorecard-interactive";
import { SkillCard } from "./skill-card";

export function PackView({ pack }: { pack: PublicPack }) {
  const role = pack.attendee.title?.trim() || "my role";
  const company = pack.attendee.company?.trim() || "my company";

  const resolved = pack.items
    .map((item): { item: PublicPackItem; skill: Skill } | null => {
      const base = getSkillBySlug(item.slug);
      if (!base) {
        // Defensive: a stale/typo'd slug in skill_pack_items must never crash
        // the page for a live attendee — skip it and log for follow-up.
        console.error(`fsga pack-view: unknown skill slug "${item.slug}" — skipping`);
        return null;
      }
      const skill: Skill = {
        ...base,
        name: item.signature?.name ?? base.name,
        starterPrompt: fillPlaceholders(item.signature?.starterPrompt ?? base.starterPrompt, { role, company }),
      };
      return { item, skill };
    })
    .filter((x): x is { item: PublicPackItem; skill: Skill } => x !== null);

  return (
    <div className="max-w-[680px] mx-auto">
      <PackHeader attendee={pack.attendee} customIntro={pack.pack.customIntro} summary={pack.pack.summary} />

      <p className="text-[13px] text-ink-muted leading-[1.6] mb-6 -mt-3">
        A starting point — not a prescription. Copy any of these into your own AI, or use the one below as the
        seed for the Skill only you could build.
      </p>

      <div className="grid gap-5">
        {resolved.map(({ item, skill }) => (
          <SkillCard
            key={skill.slug}
            skill={skill}
            customReason={item.customReason}
            recommendedFirst={item.recommendedFirst}
            isSignature={Boolean(item.signature)}
            rank={item.rank}
          />
        ))}
      </div>

      <div className="mt-10 bg-bg-card border border-line rounded-[18px] p-6 sm:p-7">
        <div className="text-[10px] tracking-[0.08em] uppercase text-ink-faint">
          The Skill Opportunity Calculator
        </div>
        <h2 className="text-[18px] font-bold tracking-[-0.02em] mt-2">Should it become a Skill?</h2>
        <p className="text-[13px] text-ink-muted leading-[1.6] mt-1.5 mb-5">
          Pick one repeated task from your week — yours, not ours — and answer four quick questions.
          The meter climbs as you go.
        </p>
        <ScorecardInteractive variant="page" />
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="bg-bg-card border border-accent rounded-[18px] p-6 sm:p-7 flex flex-col items-start gap-3">
          <div className="text-[10px] tracking-[0.08em] uppercase text-ink-faint">Your move</div>
          <p className="text-[15px] text-ink leading-[1.55] font-medium">
            The best Skill is the one built around your work. Start from your top pick — the sentence is already
            filled in.
          </p>
          <Btn
            href={`/fsga/build-your-own${resolved[0] ? buildYourOwnQuery(resolved[0].skill) : ""}`}
            variant="primary"
          >
            Build your own Skill
          </Btn>
        </div>

        <div className="bg-accent text-accent-ink rounded-[18px] p-6 sm:p-7 flex flex-col items-start gap-3">
          <Pill variant="chip" className="!bg-accent-ink !text-accent">
            Creator CTO
          </Pill>
          <p className="text-[14px] leading-[1.55] opacity-[0.85]">
            More AI workflows and real builds for creators, every week.
          </p>
          <Btn href={LINKS.youtube} variant="dark">
            Subscribe on YouTube
          </Btn>
        </div>
      </div>
    </div>
  );
}
