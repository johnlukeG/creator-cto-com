// FSGA workshop — static integrity check for the skill library + matching rules.
//
// Usage: npm run fsga:check
//
// NO DB. Pure data/logic assertions:
//   - exactly 40 skills, unique slugs, valid categories
//   - every skill has non-empty starterPrompt/inputs/processSteps/outputs
//   - every slug referenced by matching.ts's role + pain rule tables exists
//     in the library (also enforced at matching.ts's module init — this
//     script just surfaces that failure clearly instead of as a stack trace)
//   - every RoleCategory yields >= 5 matches via matchSkills()

import { SKILLS } from "../../lib/fsga/skills/library";
import { matchSkills } from "../../lib/fsga/matching";
import { ROLE_CATEGORIES, SKILL_CATEGORIES } from "../../lib/fsga/skills/types";

function fail(message: string): never {
  console.error(`fsga:check FAILED — ${message}`);
  process.exit(1);
}

function nonEmptyArray(value: unknown): value is unknown[] {
  return Array.isArray(value) && value.length > 0;
}

function main(): void {
  if (SKILLS.length !== 40) {
    fail(`expected exactly 40 skills, found ${SKILLS.length}`);
  }

  const slugs = new Set<string>();
  for (const skill of SKILLS) {
    if (slugs.has(skill.slug)) fail(`duplicate slug: ${skill.slug}`);
    slugs.add(skill.slug);

    if (!(SKILL_CATEGORIES as readonly string[]).includes(skill.category)) {
      fail(`skill "${skill.slug}" has invalid category: ${skill.category}`);
    }
    if (!skill.starterPrompt || skill.starterPrompt.trim() === "") {
      fail(`skill "${skill.slug}" has an empty starterPrompt`);
    }
    if (!nonEmptyArray(skill.inputs)) fail(`skill "${skill.slug}" has empty inputs`);
    if (!nonEmptyArray(skill.processSteps)) fail(`skill "${skill.slug}" has empty processSteps`);
    if (!nonEmptyArray(skill.outputs)) fail(`skill "${skill.slug}" has empty outputs`);
  }

  for (const role of ROLE_CATEGORIES) {
    const matches = matchSkills({ roleCategory: role });
    if (matches.length < 5) {
      fail(`matchSkills({ roleCategory: "${role}" }) returned only ${matches.length} matches (need >= 5)`);
    }
    for (const match of matches) {
      if (!slugs.has(match.slug)) {
        fail(`matchSkills({ roleCategory: "${role}" }) returned unknown slug: ${match.slug}`);
      }
    }
  }

  console.log(
    `fsga:check OK — ${SKILLS.length} skills across ${SKILL_CATEGORIES.length} categories; ` +
      `all ${ROLE_CATEGORIES.length} role categories yield >= 5 matches; all rule-table slugs valid.`,
  );
}

main();
