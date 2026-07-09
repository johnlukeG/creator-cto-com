// FSGA workshop — static pack layer (no-Supabase mode).
//
// Drop-in replacement for the public read-path of lib/fsga/db/queries.ts:
// getPublicPackBySlug and searchAttendees keep the exact names, signatures,
// and return shapes, so reverting to the DB is a pure import flip at the two
// public call sites (pack page, search API route). The import from
// ../db/queries below is type-only — erased at compile time, zero runtime DB
// dependency.
//
// Every attendee's pack is derived once at module load: matchSkills() for
// the shortlist, buildPackCopy() for the templated copy, then PACK_OVERRIDES
// applied per field. All derived packs are public ("approved"), or
// "featured_for_demo" when the override flags them.

import type { AttendeeSearchResult, PublicPack, PublicPackItem } from "../db/queries";
import { matchSkills } from "../matching";
import { buildPackCopy } from "../pack-copy";
import { getSkillBySlug } from "../skills/library";
import { ATTENDEES } from "./attendees";
import { PACK_OVERRIDES } from "./overrides";

// Fail fast at module init (mirrors matching.ts / deck/static-data.ts): a bad
// slug or override here must break the build, never render a gap to a live
// attendee.
function buildPacks(): Map<string, PublicPack> {
  const packs = new Map<string, PublicPack>();
  const problems: string[] = [];

  for (const a of ATTENDEES) {
    if (packs.has(a.slug)) problems.push(`duplicate attendee slug: ${a.slug}`);

    const attendee = { name: `${a.firstName} ${a.lastName}`, company: a.company, title: a.title };
    const override = PACK_OVERRIDES[a.slug];

    const items: PublicPackItem[] = override?.items
      ? override.items.map((item, i) => ({
          slug: item.skillSlug,
          rank: i + 1,
          customReason: item.customReason ?? null,
          customExample: item.customExample ?? null,
          recommendedFirst: i === 0,
        }))
      : matchSkills({
          roleCategory: a.roleCategory,
          companyType: a.companyType,
          seniority: null,
          pain: null,
        }).map((m, i) => ({
          slug: m.slug,
          rank: i + 1,
          customReason: m.reason,
          customExample: null,
          recommendedFirst: m.recommendedFirst,
        }));

    if (items.length === 0) problems.push(`${a.slug}: pack has no items`);
    for (const item of items) {
      if (!getSkillBySlug(item.slug)) problems.push(`${a.slug}: unknown skill slug "${item.slug}"`);
    }

    // Curated signature hero: reuse a real library skill's guts, brand its
    // name + reason + (optional) prompt, and prepend it at rank 1. Dedupe its
    // base slug out of the matched tail so it never appears twice.
    if (override?.hero) {
      const base = getSkillBySlug(override.hero.baseSkillSlug);
      if (!base) {
        problems.push(`${a.slug}: hero references unknown base skill "${override.hero.baseSkillSlug}"`);
      } else {
        const tail = items
          .filter((it) => it.slug !== override.hero!.baseSkillSlug)
          .map((it, i) => ({ ...it, rank: i + 2, recommendedFirst: false }));
        items.length = 0;
        items.push(
          {
            slug: base.slug,
            rank: 1,
            customReason: override.hero.customReason,
            customExample: null,
            recommendedFirst: true,
            signature: {
              name: override.hero.name,
              starterPrompt: override.hero.starterPrompt ?? base.starterPrompt,
            },
          },
          ...tail,
        );
      }
    }

    const copy = buildPackCopy(attendee, a.roleCategory, items.length);

    packs.set(a.slug, {
      attendee,
      pack: {
        title: override?.title ?? copy.title,
        summary: override?.summary ?? copy.summary,
        rationale: override?.rationale ?? copy.rationale,
        customIntro: override?.customIntro ?? copy.customIntro,
        status: override?.featuredForDemo ? "featured_for_demo" : "approved",
        featuredForDemo: override?.featuredForDemo ?? false,
      },
      items,
    });
  }

  for (const slug of Object.keys(PACK_OVERRIDES)) {
    if (!packs.has(slug)) problems.push(`override references unknown attendee slug: ${slug}`);
  }

  if (problems.length > 0) {
    throw new Error(`lib/fsga/data/packs.ts: ${problems.join("; ")}`);
  }

  return packs;
}

const PACKS = buildPacks();

/** Every attendee slug, for generateStaticParams on the pack page. */
export function getAllPackSlugs(): string[] {
  return [...PACKS.keys()];
}

/** Mirrors queries.ts: fetch a single pack by public slug, or null if absent. */
export async function getPublicPackBySlug(slug: string): Promise<PublicPack | null> {
  return PACKS.get(slug) ?? null;
}

/**
 * Mirrors queries.ts: case-insensitive substring match on name or company,
 * sorted by name, capped at 10. Returns only {name, company, slug} — never
 * anything more.
 */
export async function searchAttendees(q: string): Promise<AttendeeSearchResult[]> {
  const needle = q.trim().toLowerCase();
  if (!needle) return [];

  return ATTENDEES.map((a) => ({
    name: `${a.firstName} ${a.lastName}`,
    company: a.company,
    slug: a.slug,
  }))
    .filter((a) => a.name.toLowerCase().includes(needle) || a.company.toLowerCase().includes(needle))
    .sort((x, y) => x.name.localeCompare(y.name))
    .slice(0, 10);
}
