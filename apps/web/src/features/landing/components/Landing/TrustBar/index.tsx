const mutedColor = "#6E6E73";
const fontStack = "system-ui, -apple-system, BlinkMacSystemFont, sans-serif";

export function TrustBar() {
  return (
    <section style={{
      borderTop: "1px solid rgba(0,0,0,0.06)",
      borderBottom: "1px solid rgba(0,0,0,0.06)",
      padding: "20px 24px", background: "#ffffff",
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto",
        display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center",
        gap: 12, fontSize: 13, color: mutedColor,
      }}>
        <span style={{ fontWeight: 500 }}>Built with</span>
        {["NestJS", "React", "Supabase", "Google Gemini", "GitHub"].map((name, i) => (
          <span key={name} style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
            {i > 0 && <span style={{ width: 3, height: 3, borderRadius: "50%", background: "currentColor", opacity: 0.5 }} />}
            <svg height="16" viewBox={`0 0 ${name.length * 8 + 8} 16`} style={{ display: "block" }}>
              <text x="4" y="12" fontFamily={fontStack} fontSize="13" fontWeight="600" fill="currentColor">{name}</text>
            </svg>
          </span>
        ))}
      </div>
    </section>
  );
}
