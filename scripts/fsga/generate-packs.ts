// FSGA workshop — generate (or regenerate) attendee skill packs.
//
// Usage: npm run fsga:packs [-- --force]
//
// For every attendee: skip if their pack already carries a human-reviewed
// status (review_needed, approved, featured_for_demo) — unless --force is
// passed. Otherwise, upsert the pack with templated copy + a fresh
// matchSkills() shortlist, replacing its items wholesale inside a
// transaction. Attendees with no role_category fall back to the 'other'
// rules and land in review_needed (a human should assign a role before this
// pack goes live) rather than auto_generated.
//
// generatePackForAttendee() is exported so seed-fake.ts can reuse the exact
// same generation path for its fixture attendees.

import { eq } from "drizzle-orm";
import { pathToFileURL } from "node:url";
import { attendees, skillPackItems, skillPacks, type PackStatus } from "../../lib/fsga/db/schema";
import { matchSkills } from "../../lib/fsga/matching";
import type { CompanyType, RoleCategory } from "../../lib/fsga/skills/types";
import { flag, runScript, scriptDb, type ScriptDb } from "./lib";

const LOCKED_STATUSES: PackStatus[] = ["review_needed", "approved", "featured_for_demo"];

const ROLE_LABELS: Record<RoleCategory, string> = {
  "executive-founder": "founders and execs",
  "sales-partnerships": "sales and partnerships leads",
  "marketing-content": "marketing and content teams",
  "product-ops": "product and ops leads",
  "hiring-people": "hiring managers",
  "analyst-research": "analysts and researchers",
  other: "busy operators",
};

function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] || name;
}

function buildPackCopy(
  attendee: { name: string; company: string; title: string | null },
  roleCategory: RoleCategory,
  skillCount: number,
): { title: string; summary: string; rationale: string; customIntro: string } {
  const first = firstName(attendee.name);
  const roleLabel = ROLE_LABELS[roleCategory];
  const titleAt = attendee.title ? `${attendee.title} at ${attendee.company}` : attendee.company;

  return {
    title: `${first}'s AI Skill Pack`,
    summary: `A shortlist of ${skillCount} AI skills matched to ${roleLabel}, picked for ${first}'s work as ${titleAt}.`,
    rationale: `These target the repeated, manual work that eats a week at ${attendee.company} — built to be useful today, not just interesting.`,
    customIntro: `Welcome, ${first}! Based on your role at ${attendee.company}, here are the AI skills we think you'll reach for first.`,
  };
}

/**
 * Generates (or fully regenerates) a single attendee's pack: upserts the
 * pack row, replaces its items with a fresh matchSkills() shortlist, and
 * returns the resulting status. Does NOT check for locked statuses — callers
 * (this script's main loop, or seed-fake.ts) own that decision.
 */
export async function generatePackForAttendee(
  db: ScriptDb,
  attendee: typeof attendees.$inferSelect,
): Promise<PackStatus> {
  const roleCategory = attendee.roleCategory as RoleCategory | null;
  const effectiveRole: RoleCategory = roleCategory ?? "other";
  const status: PackStatus = roleCategory ? "auto_generated" : "review_needed";

  const matches = matchSkills({
    roleCategory: effectiveRole,
    companyType: attendee.companyType as CompanyType | null,
    seniority: attendee.seniority,
    pain: null,
  });

  const copy = buildPackCopy(attendee, effectiveRole, matches.length);

  await db.transaction(async (tx) => {
    const [pack] = await tx
      .insert(skillPacks)
      .values({
        attendeeId: attendee.id,
        title: copy.title,
        summary: copy.summary,
        rationale: copy.rationale,
        customIntro: copy.customIntro,
        status,
        // featuredForDemo intentionally omitted: schema default (false) covers
        // a brand-new pack, and it must never be touched on the update branch
        // below — it's admin curation, orthogonal to content regeneration.
      })
      .onConflictDoUpdate({
        target: skillPacks.attendeeId,
        set: {
          title: copy.title,
          summary: copy.summary,
          rationale: copy.rationale,
          customIntro: copy.customIntro,
          status,
          updatedAt: new Date(),
          // featuredForDemo NOT included — see comment above. Even under
          // --force, regenerating a pack's content/status must not silently
          // un-feature a pack an admin already curated for the live demo.
        },
      })
      .returning({ id: skillPacks.id });

    await tx.delete(skillPackItems).where(eq(skillPackItems.packId, pack.id));

    if (matches.length > 0) {
      await tx.insert(skillPackItems).values(
        matches.map((m, i) => ({
          packId: pack.id,
          skillSlug: m.slug,
          rank: i + 1,
          customReason: m.reason,
          recommendedFirst: m.recommendedFirst,
        })),
      );
    }
  });

  return status;
}

async function main(): Promise<void> {
  const force = flag("force");
  const db = scriptDb();

  const allAttendees = await db.select().from(attendees);
  const existingPacks = await db
    .select({ attendeeId: skillPacks.attendeeId, status: skillPacks.status })
    .from(skillPacks);
  const statusByAttendee = new Map(existingPacks.map((p) => [p.attendeeId, p.status as PackStatus]));

  const counts: Record<string, number> = { skipped: 0, auto_generated: 0, review_needed: 0 };

  for (const attendee of allAttendees) {
    const existingStatus = statusByAttendee.get(attendee.id);
    if (existingStatus && LOCKED_STATUSES.includes(existingStatus) && !force) {
      counts.skipped++;
      continue;
    }

    const status = await generatePackForAttendee(db, attendee);
    counts[status] = (counts[status] ?? 0) + 1;
  }

  console.log("generate-packs:");
  for (const [key, value] of Object.entries(counts)) {
    console.log(`  ${key}: ${value}`);
  }
  if (force) console.log("  (--force: regenerated packs even if previously human-reviewed)");
}

const isMain = import.meta.url === pathToFileURL(process.argv[1] ?? "").href;
if (isMain) {
  runScript(main);
}
