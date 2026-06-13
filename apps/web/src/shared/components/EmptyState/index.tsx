import { FileCodeIcon } from "@primer/octicons-react";
import { Button } from "@primer/react";
import styles from "./index.module.css";

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
  onAction,
}: EmptyStateProps) {
  return (
    <div className={styles['empty-state']}>
      <Icon size={64} fill={mutedColor} />
      <h2 className={styles['empty-state-title']}>{title}</h2>
      <p className={styles['empty-state-description']}>
        {description}
      </p>
      {onAction && (
        <Button variant="primary" onClick={onAction} sx={{ mt: 3 }}>
          {title.includes("team") ? "Create Team" : "Get Started"}
        </Button>
      )}
    </div>
  );
}
