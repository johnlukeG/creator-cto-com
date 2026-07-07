// FSGA workshop — seed 12 clearly-fake demo attendees.
//
// Usage: npm run fsga:seed
//
// Covers every RoleCategory at least once. Upserts by a fixed natural key
// (so re-running is a no-op on the attendee rows, per makePublicSlug
// stability), runs the exact same pack-generation path as generate-packs.ts,
// then force-sets every fake pack to 'approved' and flags 3 of them
// (one exec, one sales, one marketing) as featured_for_demo so the live
// deck/demo always has real-looking data to show.

import { inArray } from "drizzle-orm";
import { attendees, skillPacks } from "../../lib/fsga/db/schema";
import type { RoleCategory } from "../../lib/fsga/skills/types";
import { makePublicSlug } from "../../lib/fsga/slug";
import { runScript, scriptDb } from "./lib";
import { generatePackForAttendee } from "./generate-packs";

interface FakeAttendee {
  naturalKey: string;
  name: string;
  company: string;
  title: string;
  roleCategory: RoleCategory;
  seniority: string;
  featured?: boolean;
}

const FAKE_ATTENDEES: FakeAttendee[] = [
  {
    naturalKey: "seed:exec-1",
    name: "Alex Rivera",
    company: "Gridiron Analytics (Demo)",
    title: "CEO",
    roleCategory: "executive-founder",
    seniority: "executive",
    featured: true,
  },
  {
    naturalKey: "seed:sales-1",
    name: "Jordan Lee",
    company: "Fantasy Forge Media (Demo)",
    title: "VP Partnerships",
    roleCategory: "sales-partnerships",
    seniority: "vp",
    featured: true,
  },
  {
    naturalKey: "seed:marketing-1",
    name: "Casey Morgan",
    company: "Blitz Weekly (Demo)",
    title: "Head of Content",
    roleCategory: "marketing-content",
    seniority: "head",
    featured: true,
  },
  {
    naturalKey: "seed:product-1",
    name: "Taylor Brooks",
    company: "Prop Bet Labs (Demo)",
    title: "Director of Product",
    roleCategory: "product-ops",
    seniority: "director",
  },
  {
    naturalKey: "seed:hiring-1",
    name: "Morgan Ellis",
    company: "Redzone Talent (Demo)",
    title: "Head of People",
    roleCategory: "hiring-people",
    seniority: "head",
  },
  {
    naturalKey: "seed:analyst-1",
    name: "Riley Chen",
    company: "Snap Count Analytics (Demo)",
    title: "Research Lead",
    roleCategory: "analyst-research",
    seniority: "lead",
  },
  {
    naturalKey: "seed:other-1",
    name: "Sam Parker",
    company: "Draft Day Ventures (Demo)",
    title: "Chief of Staff",
    roleCategory: "other",
    seniority: "manager",
  },
  {
    naturalKey: "seed:exec-2",
    name: "Drew Sullivan",
    company: "Endzone Capital (Demo)",
    title: "Founder",
    roleCategory: "executive-founder",
    seniority: "founder",
  },
  {
    naturalKey: "seed:sales-2",
    name: "Jamie Foster",
    company: "Overtime Partners (Demo)",
    title: "Sales Director",
    roleCategory: "sales-partnerships",
    seniority: "director",
  },
  {
    naturalKey: "seed:marketing-2",
    name: "Reese Campbell",
    company: "Locker Room Media (Demo)",
    title: "Growth Marketer",
    roleCategory: "marketing-content",
    seniority: "manager",
  },
  {
    naturalKey: "seed:product-2",
    name: "Avery Nguyen",
    company: "Sideline Systems (Demo)",
    title: "Product Manager",
    roleCategory: "product-ops",
    seniority: "manager",
  },
  {
    naturalKey: "seed:hiring-2",
    name: "Skyler Reed",
    company: "Huddle HR (Demo)",
    title: "Recruiting Manager",
    roleCategory: "hiring-people",
    seniority: "manager",
  },
];

async function main(): Promise<void> {
  const db = scriptDb();

  let upserted = 0;
  const attendeeIds: string[] = [];
  const featuredIds: string[] = [];

  for (const fake of FAKE_ATTENDEES) {
    const enrichment = {
      naturalKey: fake.naturalKey,
      name: fake.name,
      company: fake.company,
      title: fake.title,
      roleCategory: fake.roleCategory,
      seniority: fake.seniority,
    };

    const [row] = await db
      .insert(attendees)
      .values({ ...enrichment, publicSlug: makePublicSlug(fake.name) })
      .onConflictDoUpdate({
        target: attendees.naturalKey,
        // publicSlug never touched here either — same stability guarantee as import-attendees.ts.
        set: { ...enrichment, updatedAt: new Date() },
      })
      .returning();
    upserted++;

    await generatePackForAttendee(db, row);
    attendeeIds.push(row.id);
    if (fake.featured) featuredIds.push(row.id);
  }

  await db.update(skillPacks).set({ status: "approved", updatedAt: new Date() }).where(inArray(skillPacks.attendeeId, attendeeIds));

  await db
    .update(skillPacks)
    .set({ featuredForDemo: true, updatedAt: new Date() })
    .where(inArray(skillPacks.attendeeId, featuredIds));

  console.log("seed-fake:");
  console.log(`  upserted ${upserted} fake attendee(s)`);
  console.log(`  approved ${attendeeIds.length} pack(s)`);
  console.log(`  featured_for_demo: ${featuredIds.length} pack(s)`);
}

runScript(main);
