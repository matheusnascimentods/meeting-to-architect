import "./styles.css";

export function PanelBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="panel-box">
      {children}
    </div>
  );
}
