// FSGA workshop — small stroke glyphs for slide diagrams (prompt-vs-Skill
// flow strips, playbook model icons, teardown pipeline). Same conventions as
// task-icons.tsx: 24×24 viewBox, stroke inherits currentColor, size set by
// the parent in stage pixels. Kept separate from TASK_ICONS because these
// are diagram furniture, not grid-tile task icons.

import type { SVGProps } from "react";

type GlyphProps = SVGProps<SVGSVGElement>;

function glyphProps(props: GlyphProps): GlyphProps {
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

/** Chat bubble — a prompt, typed in the moment. */
export function ChatGlyph(props: GlyphProps) {
  return (
    <svg {...glyphProps(props)}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

/** Document — a produced result. */
export function DocGlyph(props: GlyphProps) {
  return (
    <svg {...glyphProps(props)}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
    </svg>
  );
}

/** Document with a check — a finished, reviewed output. */
export function CheckDocGlyph(props: GlyphProps) {
  return (
    <svg {...glyphProps(props)}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="m9 14.5 2 2 4-4" />
    </svg>
  );
}

/** Folder — the Skill, packaged know-how. */
export function FolderGlyph(props: GlyphProps) {
  return (
    <svg {...glyphProps(props)}>
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
}

/** Gear — the process, the steps the Skill knows. */
export function GearGlyph(props: GlyphProps) {
  return (
    <svg {...glyphProps(props)}>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 2.5v3" />
      <path d="M12 18.5v3" />
      <path d="M2.5 12h3" />
      <path d="M18.5 12h3" />
      <path d="m5.3 5.3 2.1 2.1" />
      <path d="m16.6 16.6 2.1 2.1" />
      <path d="m18.7 5.3-2.1 2.1" />
      <path d="m7.4 16.6-2.1 2.1" />
    </svg>
  );
}

/** Inbox tray — raw material arriving as input. */
export function InboxGlyph(props: GlyphProps) {
  return (
    <svg {...glyphProps(props)}>
      <path d="M22 12h-6l-2 3h-4l-2-3H2" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  );
}
