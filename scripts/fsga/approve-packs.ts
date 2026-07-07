// FSGA workshop — approve auto-generated packs.
//
// Usage: npm run fsga:approve -- --all
//        npm run fsga:approve -- --slugs alex-rivera-ay3b,jordan-lee-9k2p
//
// Transitions packs from auto_generated -> approved (either every such pack,
// or only the ones belonging to the given attendee publicSlugs). Packs
// already sitting in review_needed, approved, or featured_for_demo are left
// alone — this script only flips the one specific transition it's named for.

import { and, eq, inArray } from "drizzle-orm";
import { attendees, skillPacks } from "../../lib/fsga/db/schema";
import { flag, option, runScript, scriptDb } from "./lib";

async function main(): Promise<void> {
  const all = flag("all");
  const slugsArg = option("slugs");

  if (!all && !slugsArg) {
    throw new Error("Usage: npm run fsga:approve -- --all | --slugs slug-a,slug-b");
  }

  const db = scriptDb();

  if (all) {
    const rows = await db
      .update(skillPacks)
      .set({ status: "approved", updatedAt: new Date() })
      .where(eq(skillPacks.status, "auto_generated"))
      .returning({ id: skillPacks.id });
    console.log(`approve-packs: approved ${rows.length} pack(s) (--all, auto_generated -> approved).`);
    return;
  }

  const slugs = (slugsArg ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (slugs.length === 0) {
    throw new Error("--slugs requires at least one comma-separated publicSlug");
  }

  const matches = await db
    .select({ packId: skillPacks.id })
    .from(skillPacks)
    .innerJoin(attendees, eq(skillPacks.attendeeId, attendees.id))
    .where(and(inArray(attendees.publicSlug, slugs), eq(skillPacks.status, "auto_generated")));

  if (matches.length === 0) {
    console.log(`approve-packs: approved 0 pack(s) — no auto_generated packs found for slugs: ${slugs.join(", ")}`);
    return;
  }

  const packIds = matches.map((m) => m.packId);
  await db
    .update(skillPacks)
    .set({ status: "approved", updatedAt: new Date() })
    .where(inArray(skillPacks.id, packIds));

  console.log(`approve-packs: approved ${packIds.length} pack(s) for slugs: ${slugs.join(", ")}.`);
}

runScript(main);
