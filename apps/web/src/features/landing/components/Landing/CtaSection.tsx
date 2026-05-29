import { Button } from "@primer/react";

interface CtaSectionProps {
  onStart: () => void;
}

export function CtaSection({ onStart }: CtaSectionProps) {
  return (
    <section style={{ background: "#1C1C1E", color: "#ffffff", padding: "96px 24px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
        <h2 style={{ fontSize: 36, fontWeight: 700, letterSpacing: "-0.02em", margin: 0, color: "#ffffff" }}>
          Stop losing architectural decisions.
        </h2>
        <p style={{ fontSize: 18, color: "rgba(255,255,255,0.7)", marginTop: 16, marginBottom: 32, lineHeight: 1.5 }}>
          Join engineers who document smarter, not harder.
        </p>
        <Button variant="primary" size="large" onClick={onStart}>Start for Free</Button>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 20 }}>
          PDF and Markdown supported · Sequence, Class and C4 · Powered by Gemini
        </p>
      </div>
    </section>
  );
}
