import { LandingNavbar } from "./LandingNavbar";
import { HeroSection } from "./HeroSection";
import { TrustBar } from "./TrustBar";
import { ProblemSolutionSection } from "./ProblemSolutionSection";
import { DiagramTypesSection } from "./DiagramTypesSection";
import { HowItWorksSection } from "./HowItWorksSection";
import { SecuritySection } from "./SecuritySection";
import { CtaSection } from "./CtaSection";
import { LandingFooter } from "./LandingFooter";
import { useRef } from "react";

interface LandingProps {
  onGetStarted: () => void;
}

const fontStack = "system-ui, -apple-system, BlinkMacSystemFont, sans-serif";

export function Landing({ onGetStarted }: LandingProps) {
  const howRef = useRef<HTMLDivElement | null>(null);
  const scrollToHow = () => howRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <div style={{ minHeight: "100vh", background: "#ffffff", fontFamily: fontStack, color: "#1d1d1f" }}>
      <style>{`
        .m2a-hero-grid { display: grid; gap: 48px; grid-template-columns: 1fr; align-items: center; }
        @media (min-width: 960px) { .m2a-hero-grid { grid-template-columns: 6fr 4fr; gap: 64px; } }
        .m2a-hero-title { font-size: 36px; line-height: 1.05; letter-spacing: -0.03em; }
        @media (min-width: 768px) { .m2a-hero-title { font-size: 52px; } }
        .m2a-hero-actions { display: flex; gap: 12px; flex-direction: column; }
        @media (min-width: 560px) { .m2a-hero-actions { flex-direction: row; } }
        .m2a-proof { display: flex; flex-wrap: wrap; gap: 20px 24px; }
        .m2a-twocol { display: grid; gap: 20px; grid-template-columns: 1fr; }
        @media (min-width: 880px) { .m2a-twocol { grid-template-columns: 1fr 1fr; } }
        .m2a-types-grid { display: grid; gap: 20px; grid-template-columns: 1fr; }
        @media (min-width: 640px) { .m2a-types-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1180px) { .m2a-types-grid { grid-template-columns: repeat(4, 1fr); } }
        .m2a-steps-grid { display: grid; gap: 20px; grid-template-columns: 1fr; position: relative; }
        @media (min-width: 768px) { .m2a-steps-grid { grid-template-columns: repeat(4, 1fr); } }
        .m2a-steps-line { display: none; }
        @media (min-width: 768px) {
          .m2a-steps-line { display: block; position: absolute; top: 56px; left: 12%; right: 12%; height: 0; border-top: 1px dashed rgba(0,0,0,0.15); z-index: 0; }
        }
        .m2a-footer { display: flex; flex-direction: column; gap: 16px; align-items: center; text-align: center; }
        @media (min-width: 768px) { .m2a-footer { flex-direction: row; justify-content: space-between; text-align: left; } }
      `}</style>

      <LandingNavbar onSignIn={onGetStarted} />
      <main>
        <HeroSection onStart={onGetStarted} onSeeHow={scrollToHow} />
        <TrustBar />
        <ProblemSolutionSection />
        <DiagramTypesSection />
        <div ref={howRef}>
          <HowItWorksSection />
        </div>
        <SecuritySection />
        <CtaSection onStart={onGetStarted} />
      </main>
      <LandingFooter />
    </div>
  );
}
