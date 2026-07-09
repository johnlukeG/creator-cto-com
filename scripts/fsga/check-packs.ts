// FSGA workshop — static integrity check for derived attendee packs.
//
// Usage: part of `npm run fsga:check`. NO DB. Importing packs.ts runs
// buildPacks() at module load, which already fail-fasts on bad data; this
// script surfaces those failures clearly and adds hero-specific asserts.

import { getAllPackSlugs, getPublicPackBySlug } from "../../lib/fsga/data/packs";

function fail(message: string): never {
  console.error(`fsga:check FAILED — ${message}`);
  process.exit(1);
}

async function main(): Promise<void> {
  const slugs = getAllPackSlugs();
  if (slugs.length < 150) fail(`expected ~152 packs, found ${slugs.length}`);

  // Scott Fish is the curated demo hero: rank-1 item must be a signature.
  const scott = await getPublicPackBySlug("scott-fish-23us");
  if (!scott) fail("scott-fish-23us pack missing");
  const hero = scott!.items[0];
  if (!hero.recommendedFirst) fail("scott-fish-23us: rank-1 item is not recommendedFirst");
  if (!hero.signature || !hero.signature.name) fail("scott-fish-23us: rank-1 item is not a signature hero");
  // The hero's base slug must not also appear in the tail (deduped).
  const tailSlugs = scott!.items.slice(1).map((i) => i.slug);
  if (tailSlugs.includes(hero.slug)) fail("scott-fish-23us: hero base skill duplicated in the tail");

  // A non-curated attendee has NO signature item — pure unbranded pack.
  const plain = await getPublicPackBySlug("carter-phillips-2fxn");
  if (!plain) fail("carter-phillips-2fxn pack missing");
  if (plain!.items.some((i) => i.signature)) fail("carter-phillips-2fxn: unexpected signature on a non-curated pack");

  console.log(`fsga:check OK — ${slugs.length} packs; curated hero present; non-curated packs clean.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
