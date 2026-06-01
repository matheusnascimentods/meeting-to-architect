import { FileCodeIcon } from "@primer/octicons-react";
import { Button } from "@primer/react";
import "./styles.css";

const mutedColor = "#6E6E73";

interface EmptyStateProps {
  onAction?: () => void;
  title?: string;
  description?: string;
  icon?: React.ElementType;
}

export function EmptyState({
  title = "No diagrams yet",
  description = "Upload a meeting transcript to generate your first architecture diagram.",
  icon: Icon = FileCodeIcon,
}: EmptyStateProps) {
  return (
    <div className="empty-state">
      <Icon size={64} fill={mutedColor} />
      <h2 className="empty-state-title">{title}</h2>
      <p className="empty-state-description">
        {description}
      </p>
    </div>
  );
}
