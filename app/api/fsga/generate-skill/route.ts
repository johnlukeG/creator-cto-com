// FSGA workshop — AI-assisted skill draft, cost-capped.
//
// This route must NEVER return a 5xx: every failure — invalid rate-limit or
// counter reads, a capped budget, a rate-limited IP, an AI call that errors
// or returns nothing usable — degrades to the deterministic template draft
// (HTTP 200, source: "template"). The only non-200 response is a 400 for a
// malformed request body, which the client-side form already prevents by
// disabling the button until all four fields are filled in.
//
// Ordering is deliberate: the per-IP rate-limit check runs BEFORE the global
// counter increment, so a rate-limited caller never consumes a unit of the
// shared generation cap.

import { IP_RATE_LIMIT, IP_RATE_WINDOW_MINUTES } from "@/lib/fsga/config";
import { generateSkillIdea, MODEL } from "@/lib/fsga/anthropic";
import { countRecentGenerations, insertGeneratedSkillIdea, tryIncrementGenerationCounter } from "@/lib/fsga/db/queries";
import { getClientIp, hashIp } from "@/lib/fsga/rate-limit";
import { GenerateInputSchema, type GenerateInput, type SkillIdea } from "@/lib/fsga/skill-idea";
import { templateSkillIdea } from "@/lib/fsga/template-fallback";

export const maxDuration = 60;

// The global spend cap (GENERATION_CAP in lib/fsga/config.ts) is enforced by
// the counters row itself (see tryIncrementGenerationCounter's `WHERE count
// < cap`), not re-checked here — this route only reacts to true/false.

/** Best-effort audit write — recording failure must never fail the response. */
async function recordGeneration(ipHash: string, input: GenerateInput, output: SkillIdea, model: string, fallback: boolean) {
  try {
    await insertGeneratedSkillIdea({ ipHash, input, output, model, fallback });
  } catch (err) {
    console.error("fsga generate-skill: failed to record generation", err);
  }
}

async function templateResponse(ipHash: string, input: GenerateInput) {
  const idea = templateSkillIdea(input);
  await recordGeneration(ipHash, input, idea, "template", true);
  return Response.json({ source: "template", idea });
}

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }

  const parsed = GenerateInputSchema.safeParse(json);
  if (!parsed.success) {
    return Response.json({ ok: false }, { status: 400 });
  }

  const input = parsed.data;
  const ipHash = hashIp(getClientIp(request.headers));

  // Step 2 — per-IP rate limit, checked BEFORE the global counter increment
  // so a rate-limited call never consumes cap. A DB error here degrades to
  // the template path rather than a 500.
  let rateLimited: boolean;
  try {
    rateLimited = (await countRecentGenerations(ipHash, IP_RATE_WINDOW_MINUTES)) >= IP_RATE_LIMIT;
  } catch (err) {
    console.error("fsga generate-skill: rate-limit check failed, falling back to template", err);
    return templateResponse(ipHash, input);
  }
  if (rateLimited) return templateResponse(ipHash, input);

  // Step 3 — global spend cap. Same never-500 treatment on DB error.
  let allowed: boolean;
  try {
    allowed = await tryIncrementGenerationCounter();
  } catch (err) {
    console.error("fsga generate-skill: counter increment failed, falling back to template", err);
    return templateResponse(ipHash, input);
  }
  if (!allowed) return templateResponse(ipHash, input);

  // Step 4 — the AI call itself never throws; null means "fall back."
  const idea = await generateSkillIdea(input);
  if (!idea) return templateResponse(ipHash, input);

  await recordGeneration(ipHash, input, idea, MODEL, false);
  return Response.json({ source: "ai", idea });
}
