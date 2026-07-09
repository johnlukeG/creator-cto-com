// FSGA workshop — turn a resolved Skill into take-home artifacts.
//
// Pure module: no React, no DB, no network. Imported by both the server pack
// view and the client SkillActions component. Every function is deterministic
// so the pack pages stay fully static.

import type { Skill } from "./skills/types";

/**
 * Replace the two identity placeholders the library starter prompts carry —
 * [ROLE] and [COMPANY] — with the attendee's real title/company. Other
 * bracketed placeholders (e.g. [PASTE UPDATES], [NEEDS DATA]) are intentionally
 * left intact — those are the attendee's own runtime inputs.
 */
export function fillPlaceholders(text: string, ctx: { role: string; company: string }): string {
  return text.replaceAll("[ROLE]", ctx.role).replaceAll("[COMPANY]", ctx.company);
}

/**
 * A self-contained prompt an attendee can paste into any AI agent (ChatGPT,
 * Claude, etc.) and run immediately. Built from an ALREADY-RESOLVED skill —
 * callers pass a skill whose starterPrompt has had fillPlaceholders applied.
 */
export function compileSkillPrompt(skill: Skill): string {
  const steps = skill.processSteps.map((s, i) => `${i + 1}. ${s}`).join("\n");
  return [
    `You are helping me with a recurring task: ${skill.name}.`,
    skill.description,
    ``,
    `When I ask, do this:`,
    steps,
    ``,
    `I will give you: ${skill.inputs.join("; ")}.`,
    `Deliver: ${skill.outputs.join("; ")}.`,
    ``,
    `---`,
    skill.starterPrompt,
  ].join("\n");
}

// Double-quote a YAML scalar so colons, #, etc. in prose can't break the
// frontmatter mapping. Escapes backslash and double-quote per YAML spec.
function yamlString(value: string): string {
  return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

/**
 * A real SKILL.md — YAML frontmatter + body — mirroring the Anthropic Skill
 * folder shape the workshop teaches. The attendee downloads this and can drop
 * it straight into a Claude Code skills/ folder.
 */
export function compileSkillFile(skill: Skill): string {
  const bullets = (items: string[]) => items.map((i) => `- ${i}`).join("\n");
  const steps = skill.processSteps.map((s, i) => `${i + 1}. ${s}`).join("\n");
  return `---
name: ${yamlString(skill.slug)}
description: ${yamlString(skill.description)}
---

# ${skill.name}

**Best for:** ${skill.bestFor}

## When to use
${skill.repeatedWork}

## Inputs
${bullets(skill.inputs)}

## Process
${steps}

## Output
${bullets(skill.outputs)}

## Starter prompt
${skill.starterPrompt}
`;
}

/**
 * A leading-`?` query string that prefills the build-your-own form's whole
 * turn-X-into-Y-so-that-Z sentence from this skill. Values capped at the
 * form's 300-char maxLength.
 */
export function buildYourOwnQuery(skill: Skill): string {
  const cap = (s: string) => s.slice(0, 300);
  const params = new URLSearchParams({
    task: cap(skill.repeatedWork),
    input: cap(skill.inputs[0] ?? ""),
    output: cap(skill.outputs[0] ?? ""),
    goal: cap(skill.bestFor),
  });
  return `?${params.toString()}`;
}
