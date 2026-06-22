import Link from "next/link";
import type { ReactNode } from "react";

type PillVariant = "outline" | "chip" | "accent";

export function Pill({
  children,
  variant = "outline",
  className = "",
}: {
  children: ReactNode;
  variant?: PillVariant;
  className?: string;
}) {
  const base =
    "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] tracking-[0.04em] uppercase font-medium whitespace-nowrap";
  const look =
    variant === "chip"
      ? "bg-chip text-chip-ink"
      : variant === "accent"
        ? "bg-accent text-accent-ink"
        : "border border-line text-ink-muted";
  return <span className={`${base} ${look} ${className}`}>{children}</span>;
}

type BtnVariant = "primary" | "dark" | "ghost";

export function Btn({
  children,
  href,
  variant = "primary",
  icon = "↗",
  className = "",
}: {
  children: ReactNode;
  href: string;
  variant?: BtnVariant;
  icon?: ReactNode;
  className?: string;
}) {
  const base =
    "inline-flex items-center gap-2.5 px-[18px] py-3 rounded-full text-[13px] font-medium tracking-[-0.01em] no-underline cursor-pointer transition-transform duration-150 hover:-translate-y-0.5";
  const look =
    variant === "dark"
      ? "bg-chip text-chip-ink"
      : variant === "ghost"
        ? "bg-transparent text-ink border border-line"
        : "bg-accent text-accent-ink";
  return (
    <Link href={href} className={`${base} ${look} ${className}`}>
      <span>{children}</span>
      {icon ? <span className="text-[13px] opacity-85">{icon}</span> : null}
    </Link>
  );
}

export function Logo({ size = 32 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="flex items-center justify-center rounded-lg bg-chip text-accent font-bold tracking-[-0.06em]"
        style={{ width: size, height: size, fontSize: size * 0.5 }}
      >
        <span>{"</>"}</span>
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-[13px] font-semibold tracking-[-0.01em]">Creator CTO</span>
        <span className="text-[9.5px] opacity-55 mt-[3px] tracking-[0.04em]">creatorcto.com</span>
      </div>
    </div>
  );
}
