const mutedColor = "#6E6E73";
const accent = "#0071E3";
const cardBg = "#ffffff";
const cardShadow = "0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)";

export function HowItWorksSection() {
  return (
    <section style={{ padding: "96px 24px", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 56 }}>
        <h2 style={{ fontSize: 36, fontWeight: 700, letterSpacing: "-0.02em", margin: 0 }}>
          How it works
        </h2>
        <p style={{ fontSize: 17, color: mutedColor, marginTop: 12 }}>
          Four steps, minutes from idea to documentation.
        </p>
      </div>
      <div className="m2a-steps-grid">
        <span className="m2a-steps-line" />
        {[
          { n: 1, title: "Upload", desc: "Add your meeting transcript", icon: <UploadStepIcon /> },
          { n: 2, title: "Analyze", desc: "AI extracts the technical context", icon: <BrainStepIcon /> },
          { n: 3, title: "Generate", desc: "Choose your diagram type", icon: <DiagramStepIcon /> },
          { n: 4, title: "Share", desc: "Export or share with your team", icon: <ShareStepIcon /> },
        ].map((s) => (
          <div key={s.n} style={{
            position: "relative", zIndex: 1,
            background: cardBg, borderRadius: 16, padding: 28,
            boxShadow: cardShadow, overflow: "hidden",
          }}>
            <span style={{
              position: "absolute", top: -12, right: 4,
              fontSize: 96, fontWeight: 800, lineHeight: 1,
              color: "rgba(0,0,0,0.04)", letterSpacing: "-0.05em",
              pointerEvents: "none",
            }}>{s.n}</span>
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: "rgba(0,113,227,0.1)", color: accent,
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: 16, position: "relative",
            }}>
              {s.icon}
            </div>
            <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 6, position: "relative" }}>{s.title}</div>
            <div style={{ fontSize: 14, color: mutedColor, lineHeight: 1.5, position: "relative" }}>{s.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function UploadStepIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}
function BrainStepIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3a3 3 0 0 0-3 3v12a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Z" />
      <path d="M9 7a3 3 0 1 0 0 6" />
      <path d="M15 7a3 3 0 1 1 0 6" />
      <path d="M5 14l-1 2 2 1" />
      <path d="M19 14l1 2-2 1" />
    </svg>
  );
}
function DiagramStepIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="9" y="14" width="7" height="7" rx="1" />
      <path d="M6.5 10v2a2 2 0 0 0 2 2h.5" />
      <path d="M17.5 10v2a2 2 0 0 1-2 2H15" />
    </svg>
  );
}
function ShareStepIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.6" y1="13.5" x2="15.4" y2="17.5" />
      <line x1="15.4" y1="6.5" x2="8.6" y2="10.5" />
    </svg>
  );
}
