// FSGA workshop — import (or re-import) attendees from a CSV drop.
//
// Usage: npm run fsga:import -- <path-to-csv>
//
// Expected headers (all except name/company are optional/blank-tolerant):
//   external_id,name,company,title,email,linkedin_url,company_url,
//   role_category,company_type,seniority,notes
//
// Upserts on a natural key (external_id if present, else lower(name)|lower(company)),
// updating enrichment fields on repeat imports. `publicSlug` is set ONLY on
// insert (via makePublicSlug) and is never part of the update — it must stay
// stable forever, since it's baked into already-printed/scanned QR codes.

import { sql } from "drizzle-orm";
import { readFileSync } from "node:fs";
import { parse } from "csv-parse/sync";
import { attendees } from "../../lib/fsga/db/schema";
import { COMPANY_TYPES, ROLE_CATEGORIES, type CompanyType, type RoleCategory } from "../../lib/fsga/skills/types";
import { makePublicSlug } from "../../lib/fsga/slug";
import { positional, runScript, scriptDb } from "./lib";

function blank(value: string | undefined | null): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function validateRoleCategory(value: string | null, rowLabel: string): RoleCategory | null {
  if (value === null) return null;
  if ((ROLE_CATEGORIES as readonly string[]).includes(value)) return value as RoleCategory;
  console.warn(`import-attendees: row ${rowLabel} — invalid role_category "${value}", setting to null`);
  return null;
}

function validateCompanyType(value: string | null, rowLabel: string): CompanyType | null {
  if (value === null) return null;
  if ((COMPANY_TYPES as readonly string[]).includes(value)) return value as CompanyType;
  console.warn(`import-attendees: row ${rowLabel} — invalid company_type "${value}", setting to null`);
  return null;
}

async function main(): Promise<void> {
  const csvPath = positional(0);
  if (!csvPath) {
    throw new Error("Usage: npm run fsga:import -- <path-to-csv>");
  }

  const raw = readFileSync(csvPath, "utf8");
  const rows: Record<string, string>[] = parse(raw, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  const db = scriptDb();

  let inserted = 0;
  let updated = 0;
  let skipped = 0;

  for (const [i, row] of rows.entries()) {
    const rowLabel = `#${i + 2}`; // 1-indexed data row + header row

    const name = blank(row.name);
    const company = blank(row.company);
    if (!name || !company) {
      console.warn(`import-attendees: row ${rowLabel} — missing required name/company, skipping`);
      skipped++;
      continue;
    }

    const externalId = blank(row.external_id);
    const naturalKey = externalId ?? `${name.toLowerCase()}|${company.toLowerCase()}`;

    const roleCategory = validateRoleCategory(blank(row.role_category), rowLabel);
    const companyType = validateCompanyType(blank(row.company_type), rowLabel);

    const enrichment = {
      naturalKey,
      name,
      company,
      title: blank(row.title),
      email: blank(row.email),
      linkedinUrl: blank(row.linkedin_url),
      companyUrl: blank(row.company_url),
      notes: blank(row.notes),
      roleCategory,
      companyType,
      seniority: blank(row.seniority),
    };

    const [result] = await db
      .insert(attendees)
      .values({ ...enrichment, publicSlug: makePublicSlug(name) })
      .onConflictDoUpdate({
        target: attendees.naturalKey,
        // publicSlug is intentionally absent from `set` — it must never
        // change once assigned, so a conflict (existing attendee) leaves it
        // untouched no matter how many times this row is re-imported.
        set: { ...enrichment, updatedAt: new Date() },
      })
      .returning({ inserted: sql<boolean>`(xmax = 0)` });

    if (result.inserted) inserted++;
    else updated++;
  }

  console.log("import-attendees:");
  console.log(`  inserted: ${inserted}`);
  console.log(`  updated: ${updated}`);
  console.log(`  skipped (missing name/company): ${skipped}`);
}

runScript(main);
