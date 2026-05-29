import { ShieldIcon, LockIcon, EyeClosedIcon, PeopleIcon, LawIcon, HeartIcon } from "@primer/octicons-react";

const accent = "#0071E3";

export function SecuritySection() {
  return (
    <section style={{ background: "#F2F2F7", padding: "48px 24px" }}>
      <div className="m2a-twocol" style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div>
          <h3 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.01em", margin: "0 0 20px" }}>
            Built responsibly
          </h3>
          <EthicItem icon={<ShieldIcon size={18} />} label="End-to-end encryption (TLS + AES-256)" />
          <EthicItem icon={<LockIcon size={18} />} label="Your transcripts are never used to train AI models" />
          <EthicItem icon={<EyeClosedIcon size={18} />} label="Processing only activates on manual upload" />
        </div>
        <div>
          <h3 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.01em", margin: "0 0 20px" }}>
            Ethical by design
          </h3>
          <EthicItem icon={<PeopleIcon size={18} />} label="Full transparency — participants always know when AI is active" />
          <EthicItem icon={<LawIcon size={18} />} label="LGPD compliant data handling" />
          <EthicItem icon={<HeartIcon size={18} />} label="Privacy by design, not as an afterthought" />
        </div>
      </div>
    </section>
  );
}

function EthicItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 0", fontSize: 14, color: "#1d1d1f", lineHeight: 1.5 }}>
      <span style={{ color: accent, display: "inline-flex", marginTop: 2, flexShrink: 0 }}>{icon}</span>
      <span>{label}</span>
    </div>
  );
}
