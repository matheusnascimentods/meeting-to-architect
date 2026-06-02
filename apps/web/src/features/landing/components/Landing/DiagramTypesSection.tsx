import { Label } from "@primer/react";

const mutedColor = "#6E6E73";
const cardBg = "#ffffff";
const cardShadow = "0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)";
const fontStack = "system-ui, -apple-system, BlinkMacSystemFont, sans-serif";

type LabelVariant = "accent" | "success" | "attention" | "danger" | "done";

export function DiagramTypesSection() {
  return (
    <section style={{ padding: "0 24px 96px", maxWidth: 1280, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 56 }}>
        <h2 style={{ fontSize: 36, fontWeight: 700, letterSpacing: "-0.02em", margin: 0 }}>
          Every diagram your team needs
        </h2>
        <p style={{ fontSize: 17, color: mutedColor, marginTop: 12, maxWidth: 640, marginLeft: "auto", marginRight: "auto", lineHeight: 1.5 }}>
          M2A supports the most important architecture visualization formats used by engineering teams worldwide.
        </p>
      </div>
      <div className="m2a-types-grid">
        <DiagramTypeCard
          illustration={<SequenceIllustration />}
          tag="UML"
          tagVariant="accent"
          title="Sequence Diagram"
          description="Visualize interactions between services and actors over time. Perfect for documenting API flows, authentication, and event-driven systems."
        />
        <DiagramTypeCard
          illustration={<ClassIllustration />}
          tag="UML"
          tagVariant="accent"
          title="Class Diagram"
          description="Map object structures, attributes, methods, and relationships. Ideal for domain modeling and object-oriented design sessions."
        />
        <DiagramTypeCard
          illustration={<C4ContextIllustration />}
          tag="C4 Model"
          tagVariant="done"
          title="C4 Context Diagram"
          description="Show how your system fits into the world around it. Map users, external systems, and the boundaries of your platform at a glance."
        />
        <DiagramTypeCard
          illustration={<C4ContainerIllustration />}
          tag="C4 Model"
          tagVariant="done"
          title="C4 Container Diagram"
          description="Zoom into your system and show the internal containers — web apps, APIs, databases, and message queues — and how they communicate."
        />
      </div>
    </section>
  );
}

function DiagramTypeCard({ illustration, tag, tagVariant, title, description }: {
  illustration: React.ReactNode;
  tag: string;
  tagVariant: LabelVariant;
  title: string;
  description: string;
}) {
  return (
    <div style={{
      background: cardBg, borderRadius: 16, padding: 24,
      boxShadow: cardShadow, display: "flex", flexDirection: "column", gap: 16,
      border: "1px solid rgba(0,0,0,0.04)",
    }}>
      <div style={{
        background: "#F2F2F7", borderRadius: 12, padding: 16,
        display: "flex", alignItems: "center", justifyContent: "center",
        height: 140,
      }}>
        {illustration}
      </div>
      <div>
        <Label variant={tagVariant}>{tag}</Label>
      </div>
      <div>
        <h3 style={{ fontSize: 18, fontWeight: 600, margin: "0 0 8px", letterSpacing: "-0.01em" }}>{title}</h3>
        <p style={{ fontSize: 14, color: mutedColor, margin: 0, lineHeight: 1.5 }}>{description}</p>
      </div>
    </div>
  );
}

function SequenceIllustration() {
  return (
    <svg viewBox="0 0 200 100" width="100%" height="100%" style={{ color: "var(--fgColor-accent, #0071E3)", maxHeight: 110 }}>
      {[20, 90, 160].map((x, i) => (
        <g key={i}>
          <rect x={x} y="8" width="32" height="16" rx="3" fill="#ffffff" stroke="rgba(0,0,0,0.15)" />
          <line x1={x + 16} y1="24" x2={x + 16} y2="92" stroke="rgba(0,0,0,0.15)" strokeDasharray="2 2" />
        </g>
      ))}
      <g stroke="currentColor" strokeWidth="1.5" fill="none">
        <line x1="36" y1="44" x2="106" y2="44" markerEnd="url(#arrB)" />
        <line x1="106" y1="64" x2="176" y2="64" markerEnd="url(#arrB)" />
        <line x1="176" y1="84" x2="36" y2="84" strokeDasharray="4 3" markerEnd="url(#arrB)" />
      </g>
      <defs>
        <marker id="arrB" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
        </marker>
      </defs>
    </svg>
  );
}

function ClassIllustration() {
  return (
    <svg viewBox="0 0 200 110" width="100%" height="100%" style={{ color: "var(--fgColor-accent, #0071E3)", maxHeight: 110 }}>
      <g fill="#ffffff" stroke="rgba(0,0,0,0.18)">
        <rect x="20" y="10" width="70" height="44" rx="4" />
        <line x1="20" y1="26" x2="90" y2="26" />
        <rect x="110" y="60" width="70" height="44" rx="4" />
        <line x1="110" y1="76" x2="180" y2="76" />
      </g>
      <text x="55" y="22" textAnchor="middle" fontFamily={fontStack} fontSize="9" fontWeight="600" fill="var(--fgColor-muted, #6E6E73)">Order</text>
      <text x="55" y="38" textAnchor="middle" fontFamily={fontStack} fontSize="8" fill="var(--fgColor-muted, #6E6E73)">+id</text>
      <text x="55" y="48" textAnchor="middle" fontFamily={fontStack} fontSize="8" fill="var(--fgColor-muted, #6E6E73)">+total()</text>
      <text x="145" y="72" textAnchor="middle" fontFamily={fontStack} fontSize="9" fontWeight="600" fill="var(--fgColor-muted, #6E6E73)">Item</text>
      <text x="145" y="88" textAnchor="middle" fontFamily={fontStack} fontSize="8" fill="var(--fgColor-muted, #6E6E73)">+sku</text>
      <text x="145" y="98" textAnchor="middle" fontFamily={fontStack} fontSize="8" fill="var(--fgColor-muted, #6E6E73)">+qty</text>
      <line x1="90" y1="54" x2="110" y2="76" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#arrC)" />
      <defs>
        <marker id="arrC" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="none" stroke="currentColor" />
        </marker>
      </defs>
    </svg>
  );
}

function C4ContextIllustration() {
  return (
    <svg viewBox="0 0 200 110" width="100%" height="100%" style={{ color: "var(--fgColor-accent, #0071E3)", maxHeight: 110 }}>
      {/* Person */}
      <g stroke="rgba(0,0,0,0.25)" fill="#ffffff">
        <circle cx="20" cy="30" r="6" />
        <path d="M 12 50 Q 20 38 28 50 L 28 56 L 12 56 Z" />
      </g>
      {/* System center */}
      <rect x="70" y="38" width="60" height="34" rx="6" fill="currentColor" opacity="0.15" stroke="currentColor" />
      <text x="100" y="58" textAnchor="middle" fontFamily={fontStack} fontSize="10" fontWeight="600" fill="currentColor">M2A</text>
      {/* External */}
      <rect x="155" y="14" width="40" height="26" rx="4" fill="#ffffff" stroke="rgba(0,0,0,0.2)" />
      <text x="175" y="30" textAnchor="middle" fontFamily={fontStack} fontSize="8" fill="var(--fgColor-muted, #6E6E73)">Auth</text>
      <rect x="155" y="70" width="40" height="26" rx="4" fill="#ffffff" stroke="rgba(0,0,0,0.2)" />
      <text x="175" y="86" textAnchor="middle" fontFamily={fontStack} fontSize="8" fill="var(--fgColor-muted, #6E6E73)">Gemini</text>
      <g stroke="currentColor" strokeWidth="1.5" fill="none">
        <line x1="32" y1="48" x2="68" y2="55" />
        <line x1="132" y1="48" x2="153" y2="30" />
        <line x1="132" y1="62" x2="153" y2="80" />
      </g>
    </svg>
  );
}

function C4ContainerIllustration() {
  return (
    <svg viewBox="0 0 200 110" width="100%" height="100%" style={{ color: "var(--fgColor-accent, #0071E3)", maxHeight: 110 }}>
      <rect x="6" y="6" width="188" height="98" rx="8" fill="none" stroke="rgba(0,0,0,0.25)" strokeDasharray="4 3" />
      <rect x="20" y="30" width="46" height="30" rx="4" fill="currentColor" opacity="0.12" stroke="currentColor" />
      <text x="43" y="48" textAnchor="middle" fontFamily={fontStack} fontSize="9" fontWeight="600" fill="currentColor">Web</text>
      <rect x="78" y="30" width="46" height="30" rx="4" fill="currentColor" opacity="0.12" stroke="currentColor" />
      <text x="101" y="48" textAnchor="middle" fontFamily={fontStack} fontSize="9" fontWeight="600" fill="currentColor">API</text>
      <rect x="136" y="30" width="46" height="30" rx="4" fill="currentColor" opacity="0.12" stroke="currentColor" />
      <text x="159" y="48" textAnchor="middle" fontFamily={fontStack} fontSize="9" fontWeight="600" fill="currentColor">DB</text>
      <g stroke="currentColor" strokeWidth="1.5" fill="none">
        <line x1="66" y1="45" x2="78" y2="45" markerEnd="url(#arrD)" />
        <line x1="124" y1="45" x2="136" y2="45" markerEnd="url(#arrD)" />
      </g>
      <defs>
        <marker id="arrD" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
        </marker>
      </defs>
    </svg>
  );
}
