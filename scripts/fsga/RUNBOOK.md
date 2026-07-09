# T9 Runbook — Supabase + Vercel provisioning (user actions)

## 0. STATIC-DATA MODE (CURRENT) — read this first

The public personalization read-path currently runs **without Supabase**: the
pack page, search API, and presenter deck read committed repo data instead of
the DB. Everything below (Supabase provisioning, import/packs/approve cycle)
is dormant until you revert.

- **Data lives in** `lib/fsga/data/attendees.ts` (152 attendees, name/company/
  title/role only — **no emails committed, ever**; repo is public) and
  `lib/fsga/data/overrides.ts` (hand-tuned pack copy, item lists, and
  `featuredForDemo` flags — this replaces the admin UI for curation).
- **Packs are derived at build**: `lib/fsga/data/packs.ts` runs matchSkills()
  + buildPackCopy() per attendee; every `/fsga/pack/[slug]` page is
  prerendered (force-static + generateStaticParams). Edit an override → next
  deploy picks it up.
- **SLUGS ARE FROZEN.** They're baked into printed QR codes. Never regenerate
  or edit a slug in attendees.ts. New attendee: append a row and mint only
  that slug with `makePublicSlug()`.
- **Gate:** `npm run fsga:check` (skill library + attendee/pack assertions,
  incl. an email-leak tripwire). Run before every deploy.
- **⚠ Leads form still 500s without a DB** (`/api/fsga/leads` is untouched and
  DB-backed). Decide before the event: provision Supabase, or hide/stub the
  signup form. The AI generate-skill endpoint is fine — it falls back to a
  template without a DB.
- **Dormant while in this mode:** fsga:seed / fsga:import / fsga:packs /
  fsga:approve / fsga:warm, and the /fsga/admin UI.
- **Revert to DB mode:** flip imports back to `@/lib/fsga/db/queries` in
  `app/fsga/pack/[slug]/page.tsx` (restore `revalidate = 60`, drop
  generateStaticParams) and `app/api/fsga/search/route.ts`; restore the
  getFeaturedPacks load in `app/fsga/presenter/page.tsx`; then run the full
  §1–4 cycle. Reuse the committed slugs when importing attendees — QR codes
  depend on them.

## 1. Supabase project (once, ~5 min)
1. Vercel dashboard → your creatorcto.com project → Storage/Integrations → add **Supabase** (creates project + injects POSTGRES_* env vars), OR create at supabase.com and copy connection strings manually.
2. Ensure these env vars exist in Vercel (Production + Preview) and locally in `.env.local`:
   - `POSTGRES_URL` — Supabase **transaction pooler** URI (port 6543), append `?sslmode=require` if not present
   - `POSTGRES_URL_NON_POOLING` — direct/session URI (port 5432)
   - `ANTHROPIC_API_KEY` — from console.anthropic.com (usage cap note: endpoint has 5,000-generation hard cap ≈ $87 worst case)
   - `FSGA_IP_SALT` — any random string (`openssl rand -hex 16`)
   - `FSGA_ADMIN_PASSWORD` — strong password for /fsga/admin

## 2. Schema push + seed (once)
```sh
# drizzle-kit reads only .env, not .env.local — export first:
set -a; source .env.local; set +a
npm run db:push
```
Then in Supabase SQL editor run the block from the top comment of `lib/fsga/db/schema.ts`:
- 6 × `alter table ... enable row level security;`
- `insert into counters (key, count, cap) values ('skill_generation', 0, 5000);`

**Both steps fail silently if skipped — verify:**
```sql
select tablename, rowsecurity from pg_tables where schemaname='public';  -- all 6 = true
select * from counters where key='skill_generation';                    -- 1 row, cap 5000
```
No RLS = PostgREST open if anon key ever leaks. No counters row = every AI draft silently degrades to template.

## 3. Deploy
Push branch → merge to main (or point Vercel at skills-prezi for a preview) → verify:
- https://creatorcto.com/fsga renders
- /fsga/static renders (offline deck)
- /api/fsga/search?q=xx returns []

## 4. Real data cycle (repeat per attendee-list drop)
```sh
npm run fsga:seed                      # rehearsal ONLY — NEVER against prod after real attendees imported
                                       # (seeded fakes are status=approved → appear in public search)
npm run fsga:import data/fsga/attendees-enriched.csv
npm run fsga:packs
# review in Supabase Studio or /fsga/admin → edit intros, statuses
npm run fsga:approve -- --all          # or --slugs a,b,c
npm run fsga:warm                      # pre-warm ISR cache post-deploy
```
Enrichment: bring each raw list drop into a Claude Code session; we research role_category/company_type/seniority per attendee and emit the enriched CSV (headers: external_id,name,company,title,email,linkedin_url,company_url,role_category,company_type,seniority,notes).

## 5. Pre-event checklist
- Mark 3–5 featured packs (admin UI ★ or Studio featured_for_demo=true + status)
- Rehearse /fsga/presenter (keys: ←→/space/clicker, n notes, t timer, f fullscreen)
- Offline drill: `npm run build && npm run start` on the presentation laptop, wifi off, /fsga/static
- Phone test: QR scan from 5m, pack page, copy-prompt button (manual check — flagged from T4)
- Set ANTHROPIC_API_KEY spend alert at console.anthropic.com (budget $100)
- One real "Draft with AI" test post-deploy (the live AI path was never exercised locally — no key)
- Rehearse featured-packs slide against LIVE data: speaker notes were written around the 4 static demo archetypes; with real featured packs, adjust narration to the actual people (or keep notes generic)
- After `fsga:import`, always run `fsga:packs` and compare counts — an attendee missing from admin means their pack was never generated (inner-join hides pack-less attendees)
- Deck save-pack slide says "one tap" — the pack-page email form is two fields; narrate as "drop in your email" or tweak the body copy
