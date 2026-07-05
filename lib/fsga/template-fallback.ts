// FSGA workshop — deterministic skill-idea fallback.
//
// No I/O, no randomness, always succeeds. This is what backs the endpoint's
// "never 5xx" guarantee: whenever the AI path is unavailable, capped, or
// rate-limited, the attendee still leaves with a usable draft built purely
// from the four fields they typed.

import type { GenerateInput, SkillIdea } from "./skill-idea";

const STOPWORD_LEAD = new Set(["writing", "doing", "making", "building", "creating", "drafting", "the", "a", "an"]);

function titleCase(words: string[]): string {
  return words
    .map((w) => (w.length === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
    .join(" ");
}

/** Short, title-cased skill name derived from the repeated task, capped at ~6 words. */
function shortSkillName(repeatedTask: string): string {
  let words = repeatedTask.trim().split(/\s+/).filter(Boolean);

  // Drop a single leading filler word ("Writing the weekly summary" -> "weekly summary")
  // so the name reads like a thing, not a gerund phrase.
  while (words.length > 2 && STOPWORD_LEAD.has(words[0].toLowerCase())) {
    words = words.slice(1);
  }

  const trimmed = words.slice(0, 5);
  const name = titleCase(trimmed);
  return /\bskill\b/i.test(name) ? name : `${name} Skill`;
}

function lowerFirst(s: string): string {
  return s.length === 0 ? s : s.charAt(0).toLowerCase() + s.slice(1);
}

/** Deterministic skill idea composed straight from the four form fields. Always succeeds. */
export function templateSkillIdea(input: GenerateInput): SkillIdea {
  const { repeatedTask, inputType, outputType, successGoal } = input;

  return {
    skill_name: shortSkillName(repeatedTask),
    description: `Automates the repeated work of ${lowerFirst(repeatedTask)} — turning ${inputType} into ${outputType} so that ${successGoal}.`,
    inputs: [inputType, "Any context, examples, or edge cases a new teammate would need to do this the same way"],
    process_steps: [
      `Collect ${inputType} exactly as it normally arrives, with no manual cleanup first.`,
      `Work through the same steps you'd use for ${lowerFirst(repeatedTask)}, in order.`,
      `Draft ${outputType} using the structure you already expect it to have.`,
      `Check the draft against your usual quality bar so ${lowerFirst(successGoal)}.`,
    ],
    outputs: [outputType, "A short flag noting anything unusual that still needs a human look"],
  };
}
