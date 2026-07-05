// FSGA workshop — shared form/button atoms for the public site.
//
// Mirrors the visual idiom of components/atoms.tsx (Btn/Pill) but for native
// form controls, which need real HTML semantics (button/input/textarea/select)
// rather than Btn's <Link>-based anchor. No hooks here — safe to import from
// server components; only actually rendered inside 'use client' trees in this
// codebase (search-box, starter-flow, build-skill-form).

import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

type BtnVariant = "primary" | "dark" | "ghost";

const BTN_BASE =
  "inline-flex items-center gap-2.5 px-[18px] py-3 rounded-full text-[13px] font-medium tracking-[-0.01em] no-underline cursor-pointer transition-transform duration-150 hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 border-0";

function btnLook(variant: BtnVariant): string {
  return variant === "dark"
    ? "bg-chip text-chip-ink"
    : variant === "ghost"
      ? "bg-transparent text-ink border border-line"
      : "bg-accent text-accent-ink";
}

/** Native <button>, styled identically to Btn (components/atoms.tsx) for forms/handlers. */
export function BtnButton({
  children,
  variant = "primary",
  icon,
  className = "",
  type = "button",
  disabled,
  onClick,
}: {
  children: ReactNode;
  variant?: BtnVariant;
  icon?: ReactNode;
  className?: string;
  type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
  disabled?: boolean;
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"];
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${BTN_BASE} ${btnLook(variant)} ${className}`}
    >
      <span>{children}</span>
      {icon ? <span className="text-[13px] opacity-85">{icon}</span> : null}
    </button>
  );
}

const INPUT_CLASSES =
  "bg-bg-card border border-line rounded-xl px-4 py-3 text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none w-full font-mono text-sm";

/** Label + control wrapper, in the card idiom. */
export function Field({
  label,
  children,
  hint,
  className = "",
}: {
  label: string;
  children: ReactNode;
  hint?: string;
  className?: string;
}) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-[11px] tracking-[0.06em] uppercase text-ink-muted">{label}</span>
      {children}
      {hint ? <span className="text-[11px] text-ink-faint">{hint}</span> : null}
    </label>
  );
}

export function TextInput({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`${INPUT_CLASSES} ${className}`} {...props} />;
}

export function TextArea({
  className = "",
  rows = 3,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea rows={rows} className={`${INPUT_CLASSES} resize-none ${className}`} {...props} />;
}

export function Select({ className = "", children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={`${INPUT_CLASSES} ${className}`} {...props}>
      {children}
    </select>
  );
}
