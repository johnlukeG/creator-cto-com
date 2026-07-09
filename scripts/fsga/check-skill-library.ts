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

async function main(): Promise<void> {
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

  // Every companyType yields >= 5 matches, all slugs valid, and includes at
  // least one company accent (proof companyType actually steers selection).
  const { COMPANY_ACCENTS, UBIQUITOUS_CORE } = await import("../../lib/fsga/matching");
  for (const [companyType, accents] of Object.entries(COMPANY_ACCENTS)) {
    for (const accent of accents) {
      if (!slugs.has(accent.slug)) fail(`COMPANY_ACCENTS["${companyType}"] references unknown slug: ${accent.slug}`);
    }
    const matches = matchSkills({ roleCategory: "other", companyType: companyType as never });
    if (matches.length < 5) fail(`companyType "${companyType}" yields only ${matches.length} matches (need >= 5)`);
    const accentSlugs = new Set(accents.map((a) => a.slug));
    if (!matches.some((m) => accentSlugs.has(m.slug))) {
      fail(`companyType "${companyType}" produced no accent skill — companyType not steering selection`);
    }
  }
  // Ubiquitous core anchors every pack: a no-companyType call surfaces it.
  for (const core of UBIQUITOUS_CORE) {
    if (!slugs.has(core.slug)) fail(`UBIQUITOUS_CORE references unknown slug: ${core.slug}`);
  }
  const bareMatches = matchSkills({ roleCategory: "other", companyType: null });
  const coreSlugs = new Set(UBIQUITOUS_CORE.map((c) => c.slug));
  if (!bareMatches.every((m) => coreSlugs.has(m.slug))) {
    fail("a no-companyType 'other' pack should be entirely ubiquitous-core skills");
  }

  // skill-export helpers: placeholder fill leaves no [ROLE]/[COMPANY] residue
  // but preserves other [PASTE …] placeholders; SKILL.md is well-formed; the
  // build-your-own link carries the four prefill params.
  const exp = await import("../../lib/fsga/skill-export");
  const sample = SKILLS.find((s) => s.starterPrompt.includes("[ROLE]") && s.starterPrompt.includes("[COMPANY]"));
  if (!sample) fail("expected at least one library skill whose starterPrompt has [ROLE] and [COMPANY]");
  const filled = exp.fillPlaceholders(sample!.starterPrompt, { role: "Founder", company: "Fantasy Cares" });
  if (filled.includes("[ROLE]") || filled.includes("[COMPANY]")) fail("fillPlaceholders left [ROLE]/[COMPANY] residue");
  if (!filled.includes("Fantasy Cares") || !filled.includes("Founder")) fail("fillPlaceholders did not inject role/company");
  if (sample!.starterPrompt.includes("[PASTE") && !filled.includes("[PASTE")) fail("fillPlaceholders wrongly stripped a [PASTE …] placeholder");

  const md = exp.compileSkillFile(sample!);
  if (!md.startsWith("---\nname: ")) fail("compileSkillFile missing YAML frontmatter");
  if (!md.includes("\n## Process\n") || !md.includes("\n## Starter prompt\n")) fail("compileSkillFile missing required sections");

  const prompt = exp.compileSkillPrompt(sample!);
  if (!prompt.includes(sample!.name) || prompt.trim() === "") fail("compileSkillPrompt produced empty/nameless output");

  const q = exp.buildYourOwnQuery(sample!);
  if (!q.startsWith("?") || !q.includes("task=") || !q.includes("input=") || !q.includes("output=") || !q.includes("goal=")) {
    fail(`buildYourOwnQuery missing prefill params: ${q}`);
  }

  console.log(
    `fsga:check OK — ${SKILLS.length} skills across ${SKILL_CATEGORIES.length} categories; ` +
      `all ${ROLE_CATEGORIES.length} role categories yield >= 5 matches; all rule-table slugs valid.`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
