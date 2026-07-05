// FSGA workshop — DB query layer.
//
// Public-visibility rule (applies everywhere in this file that surfaces an
// attendee's pack to the public site): a pack is only visible when its
// status is 'approved' or 'featured_for_demo'. 'auto_generated' and
// 'review_needed' packs are pending human review and must never leak
// through search, the public pack page, or the featured-demo carousel.

import { and, asc, eq, gte, ilike, inArray, or, sql } from "drizzle-orm";
import { getDb } from "./client";
import {
  attendees,
  generatedSkillIdeas,
  leads,
  PACK_STATUSES,
  skillPackItems,
  skillPacks,
  type PackStatus,
} from "./schema";

const VISIBLE_STATUSES: PackStatus[] = ["approved", "featured_for_demo"];

export interface AttendeeSearchResult {
  name: string;
  company: string;
  slug: string;
}

/** Search visible attendees by name or company. Used by the public search box. */
export async function searchAttendees(q: string): Promise<AttendeeSearchResult[]> {
  const db = getDb();
  const pattern = `%${q}%`;

  const rows = await db
    .select({
      name: attendees.name,
      company: attendees.company,
      slug: attendees.publicSlug,
    })
    .from(attendees)
    .innerJoin(skillPacks, eq(skillPacks.attendeeId, attendees.id))
    .where(
      and(
        inArray(skillPacks.status, VISIBLE_STATUSES),
        or(ilike(attendees.name, pattern), ilike(attendees.company, pattern)),
      ),
    )
    .orderBy(asc(attendees.name))
    .limit(10);

  return rows;
}

export interface PublicPackItem {
  slug: string;
  rank: number;
  customReason: string | null;
  customExample: string | null;
  recommendedFirst: boolean;
}

export interface PublicPack {
  attendee: {
    name: string;
    company: string;
    title: string | null;
  };
  pack: {
    title: string | null;
    summary: string | null;
    rationale: string | null;
    customIntro: string | null;
    status: PackStatus;
    featuredForDemo: boolean;
  };
  items: PublicPackItem[];
}

/** Fetch a single visible pack by an attendee's public slug, or null if absent/not visible. */
export async function getPublicPackBySlug(slug: string): Promise<PublicPack | null> {
  const db = getDb();

  const [row] = await db
    .select({
      name: attendees.name,
      company: attendees.company,
      title: attendees.title,
      packId: skillPacks.id,
      packTitle: skillPacks.title,
      summary: skillPacks.summary,
      rationale: skillPacks.rationale,
      customIntro: skillPacks.customIntro,
      status: skillPacks.status,
      featuredForDemo: skillPacks.featuredForDemo,
    })
    .from(attendees)
    .innerJoin(skillPacks, eq(skillPacks.attendeeId, attendees.id))
    .where(and(eq(attendees.publicSlug, slug), inArray(skillPacks.status, VISIBLE_STATUSES)))
    .limit(1);

  if (!row) return null;

  const items = await db
    .select({
      slug: skillPackItems.skillSlug,
      rank: skillPackItems.rank,
      customReason: skillPackItems.customReason,
      customExample: skillPackItems.customExample,
      recommendedFirst: skillPackItems.recommendedFirst,
    })
    .from(skillPackItems)
    .where(eq(skillPackItems.packId, row.packId))
    .orderBy(asc(skillPackItems.rank));

  return {
    attendee: { name: row.name, company: row.company, title: row.title },
    pack: {
      title: row.packTitle,
      summary: row.summary,
      rationale: row.rationale,
      customIntro: row.customIntro,
      status: row.status as PackStatus,
      featuredForDemo: row.featuredForDemo,
    },
    items,
  };
}

export interface FeaturedPack {
  slug: string;
  attendee: {
    name: string;
    company: string;
    title: string | null;
  };
  pack: {
    title: string | null;
    summary: string | null;
    rationale: string | null;
    customIntro: string | null;
  };
  items: PublicPackItem[];
}

/** Fetch up to 5 visible packs flagged for the live demo, with their items. */
export async function getFeaturedPacks(): Promise<FeaturedPack[]> {
  const db = getDb();

  const rows = await db
    .select({
      slug: attendees.publicSlug,
      name: attendees.name,
      company: attendees.company,
      title: attendees.title,
      packId: skillPacks.id,
      packTitle: skillPacks.title,
      summary: skillPacks.summary,
      rationale: skillPacks.rationale,
      customIntro: skillPacks.customIntro,
    })
    .from(attendees)
    .innerJoin(skillPacks, eq(skillPacks.attendeeId, attendees.id))
    .where(and(eq(skillPacks.featuredForDemo, true), inArray(skillPacks.status, VISIBLE_STATUSES)))
    .orderBy(asc(attendees.name))
    .limit(5);

  if (rows.length === 0) return [];

  const packIds = rows.map((r) => r.packId);
  const items = await db
    .select({
      packId: skillPackItems.packId,
      slug: skillPackItems.skillSlug,
      rank: skillPackItems.rank,
      customReason: skillPackItems.customReason,
      customExample: skillPackItems.customExample,
      recommendedFirst: skillPackItems.recommendedFirst,
    })
    .from(skillPackItems)
    .where(inArray(skillPackItems.packId, packIds))
    .orderBy(asc(skillPackItems.rank));

  const itemsByPack = new Map<string, PublicPackItem[]>();
  for (const { packId, ...item } of items) {
    const list = itemsByPack.get(packId) ?? [];
    list.push(item);
    itemsByPack.set(packId, list);
  }

  return rows.map((row) => ({
    slug: row.slug,
    attendee: { name: row.name, company: row.company, title: row.title },
    pack: {
      title: row.packTitle,
      summary: row.summary,
      rationale: row.rationale,
      customIntro: row.customIntro,
    },
    items: itemsByPack.get(row.packId) ?? [],
  }));
}

/** Insert a lead captured from the public site (signup form, pack CTA, etc). */
export async function insertLead(data: typeof leads.$inferInsert): Promise<void> {
  const db = getDb();
  await db.insert(leads).values(data);
}

/**
 * Atomically increment the global AI-generation counter, iff it's still
 * under cap. Returns true iff the row was incremented (i.e. a generation is
 * allowed); false if the cap has been reached. Single statement so this is
 * race-safe under concurrent requests — no read-then-write gap.
 */
export async function tryIncrementGenerationCounter(): Promise<boolean> {
  const db = getDb();
  const result = await db.execute(sql`
    UPDATE counters
    SET count = count + 1
    WHERE key = 'skill_generation' AND count < cap
    RETURNING count
  `);
  return result.length > 0;
}

/** Count how many skill ideas a given IP hash has generated within the trailing window. */
export async function countRecentGenerations(ipHash: string, windowMinutes: number): Promise<number> {
  const db = getDb();
  const since = new Date(Date.now() - windowMinutes * 60_000);

  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(generatedSkillIdeas)
    .where(and(eq(generatedSkillIdeas.ipHash, ipHash), gte(generatedSkillIdeas.createdAt, since)));

  return row?.count ?? 0;
}

/** Insert a record of an AI-generated skill idea (for audit + rate limiting). */
export async function insertGeneratedSkillIdea(data: typeof generatedSkillIdeas.$inferInsert): Promise<void> {
  const db = getDb();
  await db.insert(generatedSkillIdeas).values(data);
}

// ─── Admin (app/fsga/admin/**) ───────────────────────────────────────────
//
// Unlike every query above, these are NOT status-filtered — the presenter
// reviewing packs before the event needs to see and edit every status,
// including the ones the public site must never surface. Never add `email`
// to any admin select: the admin UI must not render attendee emails (see
// task brief security notes).

export interface AdminPackListItem {
  attendee: {
    name: string;
    company: string;
    title: string | null;
    roleCategory: string | null;
    publicSlug: string;
  };
  pack: {
    id: string;
    status: PackStatus;
    featuredForDemo: boolean;
    updatedAt: Date;
    customIntro: string | null;
    title: string | null;
    summary: string | null;
  };
}

/** All packs (every status), attendee name/company/role only — no email. For the admin table. */
export async function adminListPacks(): Promise<AdminPackListItem[]> {
  const db = getDb();

  const rows = await db
    .select({
      name: attendees.name,
      company: attendees.company,
      title: attendees.title,
      roleCategory: attendees.roleCategory,
      publicSlug: attendees.publicSlug,
      packId: skillPacks.id,
      status: skillPacks.status,
      featuredForDemo: skillPacks.featuredForDemo,
      updatedAt: skillPacks.updatedAt,
      customIntro: skillPacks.customIntro,
      packTitle: skillPacks.title,
      summary: skillPacks.summary,
    })
    .from(attendees)
    .innerJoin(skillPacks, eq(skillPacks.attendeeId, attendees.id))
    .orderBy(asc(attendees.name));

  return rows.map((row) => ({
    attendee: {
      name: row.name,
      company: row.company,
      title: row.title,
      roleCategory: row.roleCategory,
      publicSlug: row.publicSlug,
    },
    pack: {
      id: row.packId,
      status: row.status as PackStatus,
      featuredForDemo: row.featuredForDemo,
      updatedAt: row.updatedAt,
      customIntro: row.customIntro,
      title: row.packTitle,
      summary: row.summary,
    },
  }));
}

export interface AdminPackItem {
  id: string;
  skillSlug: string;
  rank: number;
  customReason: string | null;
  recommendedFirst: boolean;
}

export interface AdminPackDetail {
  attendee: {
    name: string;
    company: string;
    title: string | null;
    roleCategory: string | null;
    publicSlug: string;
  };
  pack: {
    id: string;
    title: string | null;
    summary: string | null;
    rationale: string | null;
    customIntro: string | null;
    status: PackStatus;
    featuredForDemo: boolean;
    updatedAt: Date;
  };
  items: AdminPackItem[];
}

/** Full pack + attendee + items for one pack, any status, by pack id. For the admin edit page. */
export async function adminGetPack(packId: string): Promise<AdminPackDetail | null> {
  const db = getDb();

  const [row] = await db
    .select({
      name: attendees.name,
      company: attendees.company,
      title: attendees.title,
      roleCategory: attendees.roleCategory,
      publicSlug: attendees.publicSlug,
      packId: skillPacks.id,
      packTitle: skillPacks.title,
      summary: skillPacks.summary,
      rationale: skillPacks.rationale,
      customIntro: skillPacks.customIntro,
      status: skillPacks.status,
      featuredForDemo: skillPacks.featuredForDemo,
      updatedAt: skillPacks.updatedAt,
    })
    .from(skillPacks)
    .innerJoin(attendees, eq(skillPacks.attendeeId, attendees.id))
    .where(eq(skillPacks.id, packId))
    .limit(1);

  if (!row) return null;

  const items = await db
    .select({
      id: skillPackItems.id,
      skillSlug: skillPackItems.skillSlug,
      rank: skillPackItems.rank,
      customReason: skillPackItems.customReason,
      recommendedFirst: skillPackItems.recommendedFirst,
    })
    .from(skillPackItems)
    .where(eq(skillPackItems.packId, row.packId))
    .orderBy(asc(skillPackItems.rank));

  return {
    attendee: {
      name: row.name,
      company: row.company,
      title: row.title,
      roleCategory: row.roleCategory,
      publicSlug: row.publicSlug,
    },
    pack: {
      id: row.packId,
      title: row.packTitle,
      summary: row.summary,
      rationale: row.rationale,
      customIntro: row.customIntro,
      status: row.status as PackStatus,
      featuredForDemo: row.featuredForDemo,
      updatedAt: row.updatedAt,
    },
    items,
  };
}

/** Transition a pack's status. Throws on an unrecognized status rather than silently no-op'ing. */
export async function adminUpdatePackStatus(packId: string, status: PackStatus): Promise<void> {
  if (!(PACK_STATUSES as readonly string[]).includes(status)) {
    throw new Error(`adminUpdatePackStatus: invalid status "${status}"`);
  }

  const db = getDb();
  await db
    .update(skillPacks)
    .set({ status, updatedAt: new Date() })
    .where(eq(skillPacks.id, packId));
}

/** Toggle (set) the featuredForDemo flag — independent of `status` (see schema.ts). */
export async function adminToggleFeatured(packId: string, featured: boolean): Promise<void> {
  const db = getDb();
  await db
    .update(skillPacks)
    .set({ featuredForDemo: featured, updatedAt: new Date() })
    .where(eq(skillPacks.id, packId));
}

export interface AdminPackTextUpdate {
  title?: string | null;
  summary?: string | null;
  customIntro?: string | null;
}

/** Update the presenter-editable text fields on a pack. */
export async function adminUpdatePackText(packId: string, data: AdminPackTextUpdate): Promise<void> {
  const db = getDb();
  await db
    .update(skillPacks)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(skillPacks.id, packId));
}
