// FSGA workshop — full public pack page body: header + ranked SkillCards + CTAs.

import { Btn, Pill } from "@/components/atoms";
import { LINKS } from "@/lib/content";
import { getSkillBySlug } from "@/lib/fsga/skills/library";
import type { Skill } from "@/lib/fsga/skills/types";
import type { PublicPack, PublicPackItem } from "@/lib/fsga/db/queries";
import { PackHeader } from "./pack-header";
import { SkillCard } from "./skill-card";

export function PackView({ pack }: { pack: PublicPack }) {
  const resolved = pack.items
    .map((item): { item: PublicPackItem; skill: Skill } | null => {
      const skill = getSkillBySlug(item.slug);
      if (!skill) {
        // Defensive: a stale/typo'd slug in skill_pack_items must never crash
        // the page for a live attendee — skip it and log for follow-up.
        console.error(`fsga pack-view: unknown skill slug "${item.slug}" — skipping`);
        return null;
      }
      return { item, skill };
    })
    .filter((x): x is { item: PublicPackItem; skill: Skill } => x !== null);

  return (
    <div className="max-w-[680px] mx-auto">
      <PackHeader attendee={pack.attendee} customIntro={pack.pack.customIntro} summary={pack.pack.summary} />

      <div className="grid gap-5">
        {resolved.map(({ item, skill }) => (
          <SkillCard
            key={skill.slug}
            skill={skill}
            customReason={item.customReason}
            recommendedFirst={item.recommendedFirst}
            rank={item.rank}
          />
        ))}
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="bg-bg-card border border-line rounded-[18px] p-6 sm:p-7 flex flex-col items-start gap-3">
          <div className="text-[10px] tracking-[0.08em] uppercase text-ink-faint">Keep going</div>
          <p className="text-[14px] text-ink leading-[1.55]">
            Have a workflow that&rsquo;s uniquely yours? Build a Skill around it.
          </p>
          <Btn href="/fsga/build-your-own" variant="primary">
            Build your own first Skill
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
