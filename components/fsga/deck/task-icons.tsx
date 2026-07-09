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

/** Phone handset — sponsor / partnership call prep. */
function CallIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

/** Person — background on a prospective hire. */
function HireIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <circle cx="12" cy="8" r="4" />
      <path d="M5 21a7 7 0 0 1 14 0" />
    </svg>
  );
}

/** Checked list — meeting into next steps and follow-ups. */
function MeetingIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="m3 5.5 1.5 1.5L7 4.5" />
      <path d="M11 6h10" />
      <path d="m3 11.5 1.5 1.5L7 10.5" />
      <path d="M11 12h10" />
      <path d="m3 17.5 1.5 1.5L7 16.5" />
      <path d="M11 18h10" />
    </svg>
  );
}

/** Shield check — reviewing a partner, vendor, or target. */
function ReviewIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="M12 22s8-3.5 8-10V5l-8-3-8 3v7c0 6.5 8 10 8 10z" />
      <path d="m9 11.5 2 2 4-4" />
    </svg>
  );
}

/** Trend line — industry movement for leadership. */
function IndustryIcon(props: IconProps) {
  return (
    <svg {...iconProps(props)}>
      <path d="m22 7-8.5 8.5-5-5L2 17" />
      <path d="M16 7h6v6" />
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
  call: CallIcon,
  hire: HireIcon,
  meeting: MeetingIcon,
  review: ReviewIcon,
  industry: IndustryIcon,
  recap: RecapIcon,
  research: ResearchIcon,
  deck: DeckIcon,
  formats: FormatsIcon,
  schedule: ScheduleIcon,
};
