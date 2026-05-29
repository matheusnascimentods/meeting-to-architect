import "./styles.css";

export function PanelHeader({ left, right }: { left: React.ReactNode; right: React.ReactNode }) {
  return (
    <div className="panel-header">
      {left}
      {right}
    </div>
  );
}
