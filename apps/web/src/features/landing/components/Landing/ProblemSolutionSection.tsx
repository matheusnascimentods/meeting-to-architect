import { Label } from "@primer/react";
import { CheckCircleIcon, XCircleIcon } from "@primer/octicons-react";

const cardShadow = "0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)";

export function ProblemSolutionSection() {
  return (
    <section style={{ padding: "96px 24px", maxWidth: 1200, margin: "0 auto" }}>
      <div className="m2a-twocol">
        <div style={{
          background: "#1C1C1E", color: "#ffffff", borderRadius: 16, padding: 32,
          boxShadow: cardShadow,
        }}>
          <Label variant="danger">The Problem</Label>
          <h3 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.01em", margin: "16px 0 20px" }}>
            Critical decisions vanish after every meeting
          </h3>
          <BulletList
            color="#ff6b6b"
            dark
            items={[
              "Architecture decisions made verbally are never documented",
              "New team members have no source of truth to consult",
              "The bus factor increases every sprint",
            ]}
            icon="x"
          />
        </div>
        <div style={{
          background: "#ffffff", borderRadius: 16, padding: 32,
          boxShadow: cardShadow, border: "1px solid rgba(0,0,0,0.05)",
        }}>
          <Label variant="success">The Solution</Label>
          <h3 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.01em", margin: "16px 0 20px" }}>
            M2A captures, structures, and diagrams everything
          </h3>
          <BulletList
            color="#1f9d55"
            items={[
              "Upload your transcript and let AI extract the technical context",
              "Choose from UML Sequence, Class, or C4 Model diagrams",
              "Your entire decision history, versioned and always accessible",
            ]}
            icon="check"
          />
        </div>
      </div>
    </section>
  );
}

function BulletList({ items, color, icon, dark }: { items: string[]; color: string; icon: "x" | "check"; dark?: boolean }) {
  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 14 }}>
      {items.map((it) => (
        <li key={it} style={{ display: "flex", gap: 12, alignItems: "flex-start", fontSize: 15, lineHeight: 1.5, color: dark ? "rgba(255,255,255,0.85)" : "#1d1d1f" }}>
          <span style={{ color, display: "inline-flex", marginTop: 2, flexShrink: 0 }}>
            {icon === "x" ? <XCircleIcon size={18} /> : <CheckCircleIcon size={18} />}
          </span>
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}
