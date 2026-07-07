// FSGA workshop — export all captured leads to a dated CSV.
//
// Usage: npm run fsga:leads
//
// Writes data/exports/leads-YYYY-MM-DD.csv (data/ is gitignored — this is a
// local artifact for the builder, never committed).

import { asc } from "drizzle-orm";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { leads } from "../../lib/fsga/db/schema";
import { runScript, scriptDb } from "./lib";

const COLUMNS = [
  "id",
  "name",
  "email",
  "company",
  "role",
  "workflowInterest",
  "subscribe",
  "requestedPackCopy",
  "source",
  "packSlug",
  "createdAt",
] as const;

function csvEscape(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = value instanceof Date ? value.toISOString() : String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function toCsv(rows: Record<string, unknown>[]): string {
  const header = COLUMNS.join(",");
  if (rows.length === 0) return `${header}\n`;
  const body = rows.map((row) => COLUMNS.map((col) => csvEscape(row[col])).join(",")).join("\n");
  return `${header}\n${body}\n`;
}

async function main(): Promise<void> {
  const db = scriptDb();
  const rows = await db.select().from(leads).orderBy(asc(leads.createdAt));

  const dir = join(process.cwd(), "data", "exports");
  mkdirSync(dir, { recursive: true });

  const date = new Date().toISOString().slice(0, 10);
  const outPath = join(dir, `leads-${date}.csv`);
  writeFileSync(outPath, toCsv(rows), "utf8");

  console.log(`export-leads: wrote ${rows.length} lead(s) to ${outPath}`);
}

runScript(main);
