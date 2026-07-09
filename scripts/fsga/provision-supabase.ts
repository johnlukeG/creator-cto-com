// FSGA workshop — one-shot Supabase provisioning after `npm run db:push`.
//
// Usage: npm run fsga:provision
//
// db:push creates the tables but NOT row-level security or the rate-limit
// counter row (see the top comment of lib/fsga/db/schema.ts). This script
// applies both, idempotently, then prints a verification report so you can
// confirm at a glance instead of hand-running SQL in the Supabase editor.
//
//   - RLS on all 6 tables  → PostgREST stays closed even if the anon key leaks
//   - counters seed row     → AI drafts actually generate instead of silently
//                             degrading to the template fallback

import { sql } from "drizzle-orm";
import { runScript, scriptDb } from "./lib";

const RLS_TABLES = [
  "attendees",
  "skill_packs",
  "skill_pack_items",
  "leads",
  "generated_skill_ideas",
  "counters",
] as const;

async function main(): Promise<void> {
  const db = scriptDb();

  // 1. Enable RLS on every table (no-op if already enabled).
  for (const table of RLS_TABLES) {
    await db.execute(sql.raw(`alter table ${table} enable row level security;`));
    console.log(`  rls: ${table} enabled`);
  }

  // 2. Seed the rate-limit counter. `key` is the PK, so on-conflict-do-nothing
  //    keeps re-runs from resetting a counter that's already been counting.
  await db.execute(
    sql`insert into counters (key, count, cap) values ('skill_generation', 0, 5000) on conflict (key) do nothing;`,
  );
  console.log("  counters: skill_generation ensured (cap 5000)");

  // 3. Verify — mirrors the checks in scripts/fsga/RUNBOOK.md §2.
  //    db.execute returns a postgres.js RowList: array-like, directly iterable
  //    (same idiom as lib/fsga/db/queries.ts).
  const rls = (await db.execute(
    sql`select tablename, rowsecurity from pg_tables where schemaname = 'public' order by tablename;`,
  )) as unknown as Array<{ tablename: string; rowsecurity: boolean }>;
  const counter = (await db.execute(
    sql`select key, count, cap from counters where key = 'skill_generation';`,
  )) as unknown as Array<{ key: string; count: number; cap: number }>;

  console.log("\n── verification ──");
  let allSecured = true;
  for (const r of rls) {
    const ok = r.rowsecurity === true;
    if (!ok) allSecured = false;
    console.log(`  ${ok ? "✓" : "✗"} ${r.tablename}: rls=${r.rowsecurity}`);
  }

  const c = counter[0];
  console.log(
    c
      ? `  ✓ counter: ${c.key} count=${c.count} cap=${c.cap}`
      : "  ✗ counter: MISSING — AI drafts will fall back to template",
  );

  const tableCount = rls.length;
  if (!allSecured || !c || tableCount < RLS_TABLES.length) {
    throw new Error(
      "Provisioning incomplete — see ✗ rows above. Did `npm run db:push` run against this same database?",
    );
  }
  console.log("\nProvisioning OK. Supabase ready.");
}

runScript(main);
