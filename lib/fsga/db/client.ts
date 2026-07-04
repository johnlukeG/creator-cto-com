// FSGA workshop — lazy drizzle + postgres.js singleton.
//
// Lazy by design: the static build of pages that never call getDb() must
// succeed even when POSTGRES_URL is unset (e.g. this repo's local/CI build).
// Never instantiate the client at module scope.

import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

type Db = PostgresJsDatabase<typeof schema>;

const globalForFsgaDb = globalThis as unknown as {
  __fsgaDb?: Db;
};

export function getDb(): Db {
  if (globalForFsgaDb.__fsgaDb) {
    return globalForFsgaDb.__fsgaDb;
  }

  const client = postgres(process.env.POSTGRES_URL!, { prepare: false, max: 1 });
  const db = drizzle(client, { schema });

  if (process.env.NODE_ENV !== "production") {
    globalForFsgaDb.__fsgaDb = db;
  }

  return db;
}
