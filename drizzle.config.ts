import fs from "node:fs";
import path from "node:path";
import type { Config } from "drizzle-kit";

// drizzle-kit's CLI only auto-loads `.env`, never `.env.local` — but this repo
// (like Next.js) keeps local DB credentials in `.env.local`. Hand-roll a tiny
// loader here so `npm run db:push` works against the local container without
// duplicating secrets into `.env`. Only kicks in when the var isn't already
// set (e.g. by a real environment in CI/deploy), and never overrides an
// existing process.env value.
if (!process.env.POSTGRES_URL_NON_POOLING) {
  const envLocalPath = path.resolve(process.cwd(), ".env.local");
  if (fs.existsSync(envLocalPath)) {
    const contents = fs.readFileSync(envLocalPath, "utf-8");
    for (const line of contents.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;

      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;

      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      // Strip one layer of surrounding quotes, if present.
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      if (key && !(key in process.env)) {
        process.env[key] = value;
      }
    }
  }
}

export default {
  schema: "./lib/fsga/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL_NON_POOLING!,
  },
} satisfies Config;
