import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { Marquee } from "@/components/marquee";
import { Pillars } from "@/components/pillars";
import { Faq } from "@/components/faq";
import { Cta } from "@/components/cta";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="dot-grid">
      <Nav />
      <Hero />
      <Marquee />
      <Pillars />
      <Faq />
      <Cta />
      <Footer />
    </div>
  );
}
