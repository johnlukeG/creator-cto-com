# T9 Runbook — Supabase + Vercel provisioning (user actions)

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
