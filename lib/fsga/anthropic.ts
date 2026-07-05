// FSGA workshop — AI skill-idea generation.
//
// Server-only. This function must NEVER throw: every caller (the
// generate-skill route) treats a null return as "fall back to the
// deterministic template," which is the endpoint's never-5xx guarantee.
// Any failure here — missing key, network error, bad output — degrades to
// null rather than propagating.

import Anthropic, { APIError } from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { SkillIdeaSchema, type GenerateInput, type SkillIdea } from "./skill-idea";

export const MODEL = "claude-opus-4-8";

export const SKILL_SYSTEM_PROMPT = `You are helping a conference attendee turn one repeated workflow into their first AI Skill.

Produce a concise, concrete skill definition grounded entirely in the four fields the attendee provides — invent nothing beyond them. Rules:
- skill_name: at most 6 words, describes the thing, not a sentence.
- description: 1-2 sentences, plain business language, no jargon.
- inputs: 2-4 items, what the skill needs to run.
- process_steps: 3-5 imperative steps ("Collect...", "Draft...", "Check..."), in order.
- outputs: 1-3 items, what the skill produces.

Ground every field in the attendee's repeated task, input type, output type, and success goal. Do not add capabilities, tools, or steps they didn't describe.`;

function renderUserPrompt(input: GenerateInput): string {
  return `Repeated task: ${input.repeatedTask}
Input type: ${input.inputType}
Output type: ${input.outputType}
Success goal: ${input.successGoal}`;
}

let cachedClient: Anthropic | null | undefined;

/** Lazy singleton — undefined until first call, then either a client or null (no key). */
function getClient(): Anthropic | null {
  if (cachedClient !== undefined) return cachedClient;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  cachedClient = apiKey ? new Anthropic({ apiKey }) : null;
  return cachedClient;
}

/** Calls the model for a structured skill idea. Never throws — returns null on any failure. */
export async function generateSkillIdea(input: GenerateInput): Promise<SkillIdea | null> {
  const client = getClient();
  if (!client) return null;

  try {
    const response = await client.messages.parse(
      {
        model: MODEL,
        max_tokens: 600,
        system: SKILL_SYSTEM_PROMPT,
        thinking: { type: "adaptive" },
        output_config: {
          effort: "low",
          format: zodOutputFormat(SkillIdeaSchema),
        },
        messages: [{ role: "user", content: renderUserPrompt(input) }],
      },
      { timeout: 20_000, maxRetries: 1 },
    );

    return response.parsed_output ?? null;
  } catch (err) {
    if (err instanceof APIError) {
      console.error(`fsga anthropic: API error (${err.status}): ${err.message}`);
    } else {
      console.error("fsga anthropic: generation failed", err);
    }
    return null;
  }
}
