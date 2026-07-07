// FSGA workshop — warm the public FSGA page + every visible pack page.
//
// Usage: npm run fsga:warm                    (warms SITE_URL from config)
//        npx tsx scripts/fsga/warm-packs.ts http://localhost:3000   (local verification)
//
// Needs DB to enumerate publicly-visible pack slugs (status approved or
// featured_for_demo — the same public-visibility rule as lib/fsga/db/queries.ts).

import { eq, inArray } from "drizzle-orm";
import { attendees, skillPacks } from "../../lib/fsga/db/schema";
import { SITE_URL } from "../../lib/fsga/config";
import { positional, runScript, scriptDb } from "./lib";

async function main(): Promise<void> {
  const baseUrl = (positional(0) ?? SITE_URL).replace(/\/+$/, "");
  const db = scriptDb();

  const rows = await db
    .select({ slug: attendees.publicSlug })
    .from(attendees)
    .innerJoin(skillPacks, eq(skillPacks.attendeeId, attendees.id))
    .where(inArray(skillPacks.status, ["approved", "featured_for_demo"]));

  const urls = [`${baseUrl}/fsga`, ...rows.map((r) => `${baseUrl}/fsga/pack/${r.slug}`)];

  let failures = 0;
  for (const url of urls) {
    try {
      const res = await fetch(url);
      console.log(`${res.status} ${url}`);
      if (!res.ok) failures++;
    } catch (err) {
      failures++;
      console.log(`ERR   ${url} — ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  console.log(`warm-packs: warmed ${urls.length} URL(s), ${failures} failure(s).`);
  if (failures > 0) process.exitCode = 1;
}

runScript(main);
