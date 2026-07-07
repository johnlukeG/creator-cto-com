// FSGA workshop — hand-rolled line icons for the act-2 task grid slide.
// No icon library in this repo (and none wanted for six glyphs): each icon
// is a 24×24 stroke-based SVG that inherits size from its parent (the grid
// tile sets stage-pixel dimensions) and color via currentColor, so the tile
// controls both. Keys here must match the `iconKey:` prefixes used by the
// act-2 grid slide in lib/fsga/deck/deck-content.ts.

import type { ComponentType, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function iconProps(props: IconProps): IconProps {
  return {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
    ...props,
  };
}

/** Envelope — the follow-up pile. */
function FollowupIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

/** Refresh loop — the weekly recap, rebuilt on a cycle. */
function RecapIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M3 12a9 9 0 0 1 15.74-6L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-15.74 6L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  );
}

/** Magnifier — research before every call. */
function ResearchIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <circle cx="11" cy="11" r="7" />
      <path d="m16.5 16.5 4.5 4.5" />
    </svg>
  );
}

/** Presentation screen — the deck rebuild. */
function DeckIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M2 3h20" />
      <path d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3" />
      <path d="m7 21 5-5 5 5" />
    </svg>
  );
}

/** Share nodes — one thing fanned out into many formats. */
function FormatsIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="5" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="m8.6 10.7 6.8-4.4" />
      <path d="m8.6 13.3 6.8 4.4" />
    </svg>
  );
}

/** Calendar — the scheduling dance. */
function ScheduleIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <path d="M3 10h18" />
    </svg>
  );
}

export const TASK_ICONS: Record<string, ComponentType<IconProps>> = {
  followup: FollowupIcon,
  recap: RecapIcon,
  research: ResearchIcon,
  deck: DeckIcon,
  formats: FormatsIcon,
  schedule: ScheduleIcon,
};
