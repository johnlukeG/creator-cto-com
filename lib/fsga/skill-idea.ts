// FSGA workshop — shared shape for an AI- or template-drafted skill idea.
//
// One schema, two producers: lib/fsga/anthropic.ts (AI) and
// lib/fsga/template-fallback.ts (deterministic fallback). The API route and
// the client component both import this file so the shape can never drift
// between server and client.

import { z } from "zod";

export const SkillIdeaSchema = z.object({
  skill_name: z.string(),
  description: z.string(),
  inputs: z.array(z.string()),
  process_steps: z.array(z.string()),
  outputs: z.array(z.string()),
});
export type SkillIdea = z.infer<typeof SkillIdeaSchema>;

export const GenerateInputSchema = z.object({
  repeatedTask: z.string().trim().min(1).max(300),
  inputType: z.string().trim().min(1).max(300),
  outputType: z.string().trim().min(1).max(300),
  successGoal: z.string().trim().min(1).max(300),
});
export type GenerateInput = z.infer<typeof GenerateInputSchema>;
