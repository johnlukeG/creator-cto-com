// FSGA workshop — static integrity check for the committed attendee list +
// derived packs (static-data mode).
//
// Usage: npm run fsga:check (chained after check-skill-library.ts)
//
// NO DB. Pure data assertions:
//   - exactly 152 attendees (154 source rows minus 2 duplicates)
//   - slugs unique, well-formed, suffix drawn from slug.ts's alphabet
//   - no duplicate person (lowercased first|last|company tripwire)
//   - roleCategory / companyType values valid
//   - every derived pack resolves: >= 1 item, non-empty title/summary/intro
//   - PII tripwire: no "@" anywhere in any attendee record, derived pack, or
//     search projection (emails must never be committed or derivable)

import { ATTENDEES } from "../../lib/fsga/data/attendees";
import { getAllPackSlugs, getPublicPackBySlug, searchAttendees } from "../../lib/fsga/data/packs";
import { COMPANY_TYPES, ROLE_CATEGORIES } from "../../lib/fsga/skills/types";

const EXPECTED_COUNT = 152;
// slugify() output + "-" + 4 chars from SUFFIX_ALPHABET (no 0/o/1/l/i).
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*-[abcdefghjkmnpqrstuvwxyz23456789]{4}$/;

function fail(message: string): never {
  console.error(`fsga:check FAILED — ${message}`);
  process.exit(1);
}

async function main(): Promise<void> {
  if (ATTENDEES.length !== EXPECTED_COUNT) {
    fail(`expected exactly ${EXPECTED_COUNT} attendees, found ${ATTENDEES.length}`);
  }

  const slugs = new Set<string>();
  const people = new Set<string>();
  for (const a of ATTENDEES) {
    if (slugs.has(a.slug)) fail(`duplicate slug: ${a.slug}`);
    slugs.add(a.slug);
    if (!SLUG_PATTERN.test(a.slug)) fail(`malformed slug: "${a.slug}"`);

    const personKey = `${a.firstName}|${a.lastName}|${a.company}`.toLowerCase();
    if (people.has(personKey)) fail(`duplicate person: ${personKey}`);
    people.add(personKey);

    if (!a.firstName.trim() || !a.lastName.trim()) fail(`${a.slug}: empty name part`);
    if (!(ROLE_CATEGORIES as readonly string[]).includes(a.roleCategory)) {
      fail(`${a.slug}: invalid roleCategory "${a.roleCategory}"`);
    }
    if (a.companyType !== null && !(COMPANY_TYPES as readonly string[]).includes(a.companyType)) {
      fail(`${a.slug}: invalid companyType "${a.companyType}"`);
    }
    if (JSON.stringify(a).includes("@")) fail(`${a.slug}: attendee record contains "@" (email leak?)`);
  }

  const packSlugs = getAllPackSlugs();
  if (packSlugs.length !== ATTENDEES.length) {
    fail(`derived ${packSlugs.length} packs for ${ATTENDEES.length} attendees`);
  }

  for (const slug of packSlugs) {
    const pack = await getPublicPackBySlug(slug);
    if (!pack) fail(`getPublicPackBySlug("${slug}") returned null`);
    if (pack.items.length === 0) fail(`${slug}: pack has no items`);
    if (!pack.items[0].recommendedFirst) fail(`${slug}: first item not recommendedFirst`);
    if (!pack.pack.title?.trim()) fail(`${slug}: empty pack title`);
    if (!pack.pack.summary?.trim()) fail(`${slug}: empty pack summary`);
    if (!pack.pack.customIntro?.trim()) fail(`${slug}: empty pack customIntro`);
    if (JSON.stringify(pack).includes("@")) fail(`${slug}: derived pack contains "@" (email leak?)`);
  }

  // Search projection: shape + PII tripwire on a broad sample.
  const results = await searchAttendees("a");
  if (results.length === 0) fail(`searchAttendees("a") returned nothing`);
  if (results.length > 10) fail(`searchAttendees("a") returned ${results.length} rows (limit is 10)`);
  for (const r of results) {
    const keys = Object.keys(r).sort().join(",");
    if (keys !== "company,name,slug") fail(`search result leaked extra fields: ${keys}`);
    if (JSON.stringify(r).includes("@")) fail(`search result contains "@" (email leak?)`);
  }

  console.log(
    `fsga:check OK — ${ATTENDEES.length} attendees, ${packSlugs.length} derived packs all resolve; ` +
      `slugs well-formed and unique; no "@" anywhere in public data.`,
  );
}

main();
