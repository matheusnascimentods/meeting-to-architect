import { Button } from "@primer/react";

interface LandingNavbarProps {
  onSignIn: () => void;
}

const mutedColor = "#6E6E73";

export function LandingNavbar({ onSignIn }: LandingNavbarProps) {
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 10,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "16px 32px", background: "rgba(255,255,255,0.85)",
      backdropFilter: "saturate(180%) blur(20px)",
      WebkitBackdropFilter: "saturate(180%) blur(20px)",
      boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
    }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
        <span style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>M2A</span>
        <span style={{ fontSize: 13, color: mutedColor }}>Meeting to Architecture</span>
      </div>
      <Button variant="primary" onClick={onSignIn}>Sign In</Button>
    </nav>
  );
}
