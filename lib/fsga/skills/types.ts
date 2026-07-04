// FSGA workshop — skill library shared types.

export const SKILL_CATEGORIES = [
  "executive-founder",
  "sales-partnerships",
  "marketing-content",
  "product-ops",
  "hiring-people",
  "personal-productivity",
] as const;
export type SkillCategory = (typeof SKILL_CATEGORIES)[number];

export const ROLE_CATEGORIES = [
  "executive-founder",
  "sales-partnerships",
  "marketing-content",
  "product-ops",
  "hiring-people",
  "analyst-research",
  "other",
] as const;
export type RoleCategory = (typeof ROLE_CATEGORIES)[number];

export const COMPANY_TYPES = [
  "operator-platform",
  "media-content",
  "team-league",
  "brand-sponsor",
  "agency-services",
  "data-technology",
  "other",
] as const;
export type CompanyType = (typeof COMPANY_TYPES)[number];

export const WORKFLOW_PAINS = [
  "research",
  "sales-prep",
  "content",
  "hiring",
  "reporting",
  "operations",
  "customer-feedback",
  "meeting-follow-up",
  "strategy",
] as const;
export type WorkflowPain = (typeof WORKFLOW_PAINS)[number];

export type Difficulty = "starter" | "intermediate" | "advanced";
export type RiskLevel = "low" | "medium";

export interface Skill {
  name: string;
  slug: string;
  category: SkillCategory;
  description: string;
  bestFor: string;
  repeatedWork: string;
  inputs: string[];
  processSteps: string[];
  outputs: string[];
  exampleUseCase: string;
  starterPrompt: string;
  difficulty: Difficulty;
  riskLevel: RiskLevel;
  tags: string[];
}
