import { AmbientBackground } from "@/components/home/AmbientBackground";
import { Hero } from "@/components/home/Hero";
import { QuickStart } from "@/components/home/QuickStart";
import { StatsBar } from "@/components/home/StatsBar";
import { LiveDemos } from "@/components/home/LiveDemos";
import { FeaturesBento } from "@/components/home/FeaturesBento";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Benefits } from "@/components/home/Benefits";
import { Testimonials } from "@/components/home/Testimonials";
import { PricingSection } from "@/components/home/PricingSection";
import { FAQSection } from "@/components/home/FAQSection";
import { FinalCTA } from "@/components/home/FinalCTA";
import { CursorGlow } from "@/components/ui/CursorGlow";

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <AmbientBackground />
      <CursorGlow />

      <Hero />
      <QuickStart />
      <StatsBar />
      <LiveDemos />
      <FeaturesBento />
      <HowItWorks />
      <Benefits />
      <Testimonials />
      <PricingSection />
      <FAQSection />
      <FinalCTA />
    </main>
  );
}
