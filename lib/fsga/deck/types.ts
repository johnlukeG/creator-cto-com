import type { ReactNode } from "react";

export interface FeaturedPackSkill {
  skillSlug: string;
  customReason?: string;
  recommendedFirst?: boolean;
}

export interface FeaturedPackData {
  slug: string;
  attendeeName: string;
  company: string;
  title?: string;
  customIntro?: string;
  summary?: string;
  items: FeaturedPackSkill[];
}

export interface SlideContext {
  featuredPacks: FeaturedPackData[];
  staticMode: boolean;
}

export interface SlideDef {
  id: string;
  act: 1 | 2 | 3 | 4;
  title: string;
  notes: string;
  render: (ctx: SlideContext) => ReactNode;
}
