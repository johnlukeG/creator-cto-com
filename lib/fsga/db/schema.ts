// FSGA workshop — Drizzle schema (Postgres / Supabase).
//
// Run once in Supabase SQL editor after `npm run db:push`:
// alter table attendees enable row level security;
// alter table skill_packs enable row level security;
// alter table skill_pack_items enable row level security;
// alter table leads enable row level security;
// alter table generated_skill_ideas enable row level security;
// alter table counters enable row level security;
// insert into counters (key, count, cap) values ('skill_generation', 0, 5000);

import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const attendees = pgTable("attendees", {
  id: uuid("id").primaryKey().defaultRandom(),
  naturalKey: text("natural_key").notNull().unique(),
  name: text("name").notNull(),
  company: text("company").notNull(),
  title: text("title"),
  email: text("email"),
  linkedinUrl: text("linkedin_url"),
  companyUrl: text("company_url"),
  notes: text("notes"),
  roleCategory: text("role_category"),
  companyType: text("company_type"),
  seniority: text("seniority"),
  publicSlug: text("public_slug").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const PACK_STATUSES = [
  "not_started",
  "auto_generated",
  "review_needed",
  "approved",
  "featured_for_demo",
] as const;
export type PackStatus = (typeof PACK_STATUSES)[number];

export const skillPacks = pgTable(
  "skill_packs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    attendeeId: uuid("attendee_id")
      .notNull()
      .unique()
      .references(() => attendees.id, { onDelete: "cascade" }),
    title: text("title"),
    summary: text("summary"),
    rationale: text("rationale"),
    customIntro: text("custom_intro"),
    status: text("status").notNull().default("not_started"),
    featuredForDemo: boolean("featured_for_demo").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [
    index("skill_packs_status_idx").on(t.status),
    check(
      "skill_packs_status_check",
      sql`${t.status} in ('not_started','auto_generated','review_needed','approved','featured_for_demo')`,
    ),
  ],
);

export const skillPackItems = pgTable(
  "skill_pack_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    packId: uuid("pack_id")
      .notNull()
      .references(() => skillPacks.id, { onDelete: "cascade" }),
    skillSlug: text("skill_slug").notNull(),
    rank: integer("rank").notNull(),
    customReason: text("custom_reason"),
    customExample: text("custom_example"),
    recommendedFirst: boolean("recommended_first").notNull().default(false),
  },
  (t) => [uniqueIndex("skill_pack_items_pack_id_skill_slug_idx").on(t.packId, t.skillSlug)],
);

export const leads = pgTable(
  "leads",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name"),
    email: text("email"),
    company: text("company"),
    role: text("role"),
    workflowInterest: text("workflow_interest"),
    subscribe: boolean("subscribe").notNull().default(false),
    requestedPackCopy: boolean("requested_pack_copy").notNull().default(false),
    source: text("source").notNull(),
    packSlug: text("pack_slug"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("leads_created_at_idx").on(t.createdAt)],
);

export const generatedSkillIdeas = pgTable(
  "generated_skill_ideas",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    ipHash: text("ip_hash").notNull(),
    input: jsonb("input").notNull(),
    output: jsonb("output").notNull(),
    model: text("model").notNull(),
    fallback: boolean("fallback").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => [index("generated_skill_ideas_ip_hash_created_at_idx").on(t.ipHash, t.createdAt)],
);

export const counters = pgTable("counters", {
  key: text("key").primaryKey(),
  count: integer("count").notNull().default(0),
  cap: integer("cap").notNull(),
});
