import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Logo, Pill } from "@/components/atoms";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "FSGA AI Skills Workshop",
  robots: {
    index: false,
    follow: false,
  },
};

export default function FsgaLayout({ children }: { children: ReactNode }) {
  return (
    <div className="dot-grid">
      <header className="flex items-center gap-3.5 px-7 sm:px-14 py-5 border-b border-line-soft">
        <Logo />
        <Pill>/ fsga</Pill>
      </header>
      {children}
      <Footer />
    </div>
  );
}
