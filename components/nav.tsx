import Link from "next/link";
import { Btn, Logo } from "./atoms";
import { LINKS } from "@/lib/content";

const navLinks = [
  { label: "What we cover", href: "#pillars" },
  { label: "FAQ", href: "#faq" },
];

export function Nav() {
  return (
    <nav className="flex items-center justify-between px-7 py-5 border-b border-line-soft">
      <Logo />
      <div className="hidden md:flex items-center gap-7 text-[13px] text-ink-muted">
        {navLinks.map((l) => (
          <Link key={l.href} href={l.href} className="text-inherit no-underline hover:text-ink">
            {l.label}
          </Link>
        ))}
      </div>
      <Btn href={LINKS.youtube} variant="primary" icon="↗">
        Subscribe
      </Btn>
    </nav>
  );
}
