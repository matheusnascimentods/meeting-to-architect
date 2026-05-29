import { FileCodeIcon } from "@primer/octicons-react";
import { Button } from "@primer/react";
import "./styles.css";

const mutedColor = "#6E6E73";

interface EmptyStateProps {
  onAction?: () => void;
}

export function EmptyState({ onAction }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <FileCodeIcon size={64} fill={mutedColor} />
      <h2 className="empty-state-title">No diagrams yet</h2>
      <p className="empty-state-description">
        Upload a meeting transcript to generate your first architecture diagram.
      </p>
      <Button variant="primary" onClick={onAction}>Generate Diagram</Button>
    </div>
  );
}
