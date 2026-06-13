import { Button, Label } from "@primer/react";
import { CheckIcon } from "@primer/octicons-react";

interface HeroSectionProps {
  onStart: () => void;
  onSeeHow: () => void;
}

const mutedColor = "#6E6E73";
const fontStack = "system-ui, -apple-system, BlinkMacSystemFont, sans-serif";

export function HeroSection({ onStart, onSeeHow }: HeroSectionProps) {
  return (
    <section style={{
      minHeight: "calc(100vh - 72px)",
      background: "linear-gradient(180deg, #F2F2F7 0%, #ffffff 100%)",
      display: "flex", alignItems: "center",
      padding: "64px 24px",
    }}>
      <div className="m2a-hero-grid" style={{ maxWidth: 1200, margin: "0 auto", width: "100%" }}>
        <div>
          <h1 className="m2a-hero-title" style={{ fontWeight: 700, margin: 0 }}>
            Your meetings deserve better than forgotten decisions.
          </h1>
          <p style={{ fontSize: 18, color: mutedColor, marginTop: 20, maxWidth: 520, lineHeight: 1.5 }}>
            M2A transforms meeting transcripts into precise UML and C4 architecture diagrams automatically.
            Stop losing technical decisions to memory. Start building documentation that evolves with your system.
          </p>
          <div className="m2a-hero-actions" style={{ marginTop: 32 }}>
            <Button variant="primary" size="large" onClick={onStart}>Generate Your First Diagram</Button>
            <Button variant="default" size="large" onClick={onSeeHow}>See How It Works</Button>
          </div>
          <div className="m2a-proof" style={{ marginTop: 28 }}>
            <ProofItem label="No credit card required" />
            <ProofItem label="PDF and Markdown support" />
            <ProofItem label="Diagrams ready in seconds" />
          </div>
        </div>
        <div>
          <HeroMockup />
        </div>
      </div>
    </section>
  );
}

function ProofItem({ label }: { label: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, color: mutedColor }}>
      <span style={{ color: "#1f9d55", display: "inline-flex" }}><CheckIcon size={14} /></span>
      {label}
    </span>
  );
}

function HeroMockup() {
  return (
    <div style={{
      background: "#ffffff", borderRadius: 20, padding: 20,
      boxShadow: "0 20px 60px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)",
      border: "1px solid rgba(0,0,0,0.05)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <Label variant="accent">M2A · Sequence</Label>
        <span style={{ display: "flex", gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#FF5F57" }} />
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#FEBC2E" }} />
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#28C840" }} />
        </span>
      </div>
      <svg viewBox="0 0 360 240" width="100%" style={{ display: "block", color: "var(--fgColor-accent, #0071E3)" }}>
        {/* Participants */}
        {[
          { x: 40, label: "User" },
          { x: 160, label: "API" },
          { x: 280, label: "DB" },
        ].map((p) => (
          <g key={p.label}>
            <rect x={p.x} y="10" width="60" height="28" rx="6" fill="#F2F2F7" stroke="rgba(0,0,0,0.08)" />
            <text x={p.x + 30} y="28" textAnchor="middle" fontFamily={fontStack} fontSize="12" fontWeight="600" fill="var(--fgColor-muted, #6E6E73)">{p.label}</text>
            <line x1={p.x + 30} y1="44" x2={p.x + 30} y2="220" stroke="rgba(0,0,0,0.1)" strokeDasharray="3 3" />
          </g>
        ))}
        {/* Arrows */}
        <g stroke="currentColor" strokeWidth="1.5" fill="none">
          <line x1="70" y1="80" x2="190" y2="80" markerEnd="url(#arrA)" />
          <line x1="190" y1="120" x2="310" y2="120" markerEnd="url(#arrA)" />
          <line x1="310" y1="160" x2="190" y2="160" strokeDasharray="5 4" markerEnd="url(#arrA)" />
          <line x1="190" y1="200" x2="70" y2="200" markerEnd="url(#arrA)" />
        </g>
        <text x="130" y="74" textAnchor="middle" fontFamily={fontStack} fontSize="10" fill="var(--fgColor-muted, #6E6E73)">login()</text>
        <text x="250" y="114" textAnchor="middle" fontFamily={fontStack} fontSize="10" fill="var(--fgColor-muted, #6E6E73)">query user</text>
        <text x="250" y="154" textAnchor="middle" fontFamily={fontStack} fontSize="10" fill="var(--fgColor-muted, #6E6E73)">record</text>
        <text x="130" y="194" textAnchor="middle" fontFamily={fontStack} fontSize="10" fill="var(--fgColor-muted, #6E6E73)">token</text>
        <defs>
          <marker id="arrA" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
          </marker>
        </defs>
      </svg>
    </div>
  );
}
