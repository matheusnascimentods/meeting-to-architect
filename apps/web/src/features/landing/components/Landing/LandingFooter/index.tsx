import { IconButton } from "@primer/react";
import { MarkGithubIcon, GlobeIcon } from "@primer/octicons-react";

const mutedColor = "#6E6E73";

export function LandingFooter() {
  return (
    <footer style={{
      padding: "32px 32px 48px", borderTop: "1px solid rgba(0,0,0,0.06)",
      background: "#ffffff",
    }}>
      <div className="m2a-footer" style={{ maxWidth: 1200, margin: "0 auto" }}>
        <span style={{ fontSize: 13, color: mutedColor }}>© 2026 M2A. All rights reserved.</span>
        <div style={{ display: "flex", gap: 24 }}>
          <span style={{ fontSize: 13, color: mutedColor, cursor: "pointer" }}>About</span>
          <span style={{ fontSize: 13, color: mutedColor, cursor: "pointer" }}>Docs</span>
          <span style={{ fontSize: 13, color: mutedColor, cursor: "pointer" }}>Contact</span>
        </div>
        <div style={{ display: "flex", gap: 12, color: mutedColor }}>
          <IconButton icon={MarkGithubIcon} aria-label="GitHub" variant="invisible" />
          <IconButton icon={GlobeIcon} aria-label="Website" variant="invisible" />
        </div>
      </div>
    </footer>
  );
}
