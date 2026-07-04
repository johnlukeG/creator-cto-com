import type { Config } from "drizzle-kit";

export default {
  schema: "./lib/fsga/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.POSTGRES_URL_NON_POOLING!,
  },
} satisfies Config;
