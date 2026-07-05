// FSGA workshop — deck slide's compact pack card (act 4 "packs" slide).
//
// NOT the full SkillCard: a scannable-from-a-distance summary — attendee
// identity, a one-line intro, and the 5 skill names as rows, with the
// recommendedFirst row called out. Server-compatible (no hooks) so it can be
// rendered from either the presenter (DB-backed) or static (offline) route.

import { getSkillBySlug } from "@/lib/fsga/skills/library";
import type { Skill } from "@/lib/fsga/skills/types";
import type { FeaturedPackData } from "@/lib/fsga/deck/types";

export function PackSlideCard({ pack }: { pack: FeaturedPackData }) {
  const rows = pack.items
    .map((item): { skill: Skill; recommendedFirst: boolean } | null => {
      const skill = getSkillBySlug(item.skillSlug);
      if (!skill) {
        // Defensive: a stale/typo'd slug must never crash the deck live —
        // skip it and log for follow-up, same idiom as pack-view.tsx.
        console.error(`fsga deck pack-slide-card: unknown skill slug "${item.skillSlug}" — skipping`);
        return null;
      }
      return { skill, recommendedFirst: item.recommendedFirst ?? false };
    })
    .filter((row): row is { skill: Skill; recommendedFirst: boolean } => row !== null)
    // Cap at 5 rows for a consistent card height on the slide grid — the
    // static demo packs always carry exactly 5 items, but live DB packs may
    // carry more (items are rank-ordered, so recommendedFirst survives the cut).
    .slice(0, 5);

  return (
    <div className="bg-bg-card border border-line rounded-[18px] p-8 flex flex-col gap-4 h-full">
      <div>
        <div className="text-[26px] font-bold tracking-[-0.02em] text-ink leading-tight">
          {pack.attendeeName}
        </div>
        <div className="text-[18px] text-ink-muted mt-1.5">
          {pack.company}
          {pack.title ? ` · ${pack.title}` : ""}
        </div>
      </div>

      {pack.customIntro && (
        <p className="text-[16px] text-ink-muted leading-[1.5] line-clamp-1">{pack.customIntro}</p>
      )}

      <div className="grid gap-2.5 mt-1">
        {rows.map(({ skill, recommendedFirst }) => (
          <div
            key={skill.slug}
            className={`flex items-center justify-between gap-3 rounded-xl px-4 py-3 ${
              recommendedFirst ? "bg-accent/10 border border-accent" : "bg-bg-muted border border-line-soft"
            }`}
          >
            <span className="text-[19px] text-ink leading-tight">{skill.name}</span>
            {recommendedFirst && (
              <span className="shrink-0 inline-flex items-center px-2.5 py-1 rounded-full text-[11px] tracking-[0.06em] uppercase font-medium bg-accent text-accent-ink">
                start here
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
