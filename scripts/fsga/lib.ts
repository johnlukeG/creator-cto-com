// FSGA workshop — shared helpers for scripts/fsga/*.ts.
//
// These scripts run outside Next.js (via `tsx --env-file=.env.local`), so
// they own their own Postgres connection rather than reusing lib/fsga/db/client's
// lazy singleton. Prefer the non-pooling URL — several scripts run inside a
// single transaction (generate-packs.ts) or run DDL-adjacent bulk work, which
// behaves better against a direct connection than a pgbouncer-style pooler.

import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../../lib/fsga/db/schema";

type Db = PostgresJsDatabase<typeof schema>;
export type ScriptDb = Db;

let client: ReturnType<typeof postgres> | undefined;
let db: Db | undefined;

function connectionString(): string {
  const url = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;
  if (!url) {
    throw new Error(
      "Set POSTGRES_URL_NON_POOLING (or POSTGRES_URL) in .env.local before running fsga scripts.",
    );
  }
  return url;
}

/** Lazily creates (and memoizes) this process's own postgres.js client + drizzle db. */
export function scriptDb(): Db {
  if (!db) {
    client = postgres(connectionString(), { prepare: false, max: 1 });
    db = drizzle(client, { schema });
  }
  return db;
}

/** Closes the connection. Scripts should call this in a `finally` before exiting. */
export async function closeDb(): Promise<void> {
  if (client) {
    await client.end();
    client = undefined;
    db = undefined;
  }
}

// ── tiny arg helpers ─────────────────────────────────────────────────────
// All scripts are invoked as `tsx scripts/fsga/whatever.ts [args]`, so
// process.argv.slice(2) is exactly what the script was called with.

/** True if `--name` was passed anywhere in argv. */
export function flag(name: string): boolean {
  return process.argv.slice(2).includes(`--${name}`);
}

/** Value of `--name value` or `--name=value`, or undefined if not passed. */
export function option(name: string): string | undefined {
  const args = process.argv.slice(2);
  const eqPrefix = `--${name}=`;
  const eqArg = args.find((a) => a.startsWith(eqPrefix));
  if (eqArg) return eqArg.slice(eqPrefix.length);

  const idx = args.indexOf(`--${name}`);
  if (idx !== -1 && idx + 1 < args.length && !args[idx + 1].startsWith("--")) {
    return args[idx + 1];
  }
  return undefined;
}

/** The nth (0-indexed) positional (non-flag, non-flag-value) argument. */
export function positional(index: number): string | undefined {
  const args = process.argv.slice(2);
  const out: string[] = [];
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a.startsWith("--")) {
      // Skip a following value arg for `--name value` form (not `--name=value`).
      if (!a.includes("=") && i + 1 < args.length && !args[i + 1].startsWith("--")) i++;
      continue;
    }
    out.push(a);
  }
  return out[index];
}

/** Run a script's main function, closing the db and setting a non-zero exit code on failure. */
export async function runScript(main: () => Promise<void>): Promise<void> {
  try {
    await main();
  } catch (err) {
    console.error(err instanceof Error ? err.message : err);
    process.exitCode = 1;
  } finally {
    await closeDb();
  }
}
