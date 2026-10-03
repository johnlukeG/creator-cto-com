import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { About } from "@/components/about";
import { Cta } from "@/components/cta";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "About — Creator CTO",
  description:
    "Why Creator CTO exists and who's behind it. A working builder documenting the move from content creator to AI-native operator — in public.",
};

export default function AboutPage() {
  return (
    <div className="dot-grid">
      <Nav />
      <About />
      <Cta />
      <Footer />
    </div>
  );
}
