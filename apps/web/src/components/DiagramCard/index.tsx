import { IconButton, Label } from "@primer/react";
import { KebabHorizontalIcon } from "@primer/octicons-react";
import { Diagram } from "../../types";
import "./styles.css";

interface DiagramCardProps {
  diagram: Diagram;
  onOpen: () => void;
}

export function DiagramCard({ diagram, onOpen }: DiagramCardProps) {
  const { title, type, description, date, variant } = diagram;
  return (
    <div
      className="m2a-card diagram-card"
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
    >
      <div>
        <Label variant={variant}>{type}</Label>
      </div>
      <div>
        <div className="diagram-card-title">
          {title}
        </div>
        <div className="m2a-clamp diagram-card-description">
          {description}
        </div>
      </div>
      <div className="diagram-card-divider" />
      <div className="diagram-card-footer">
        <span className="diagram-card-date">{date}</span>
        <span onClick={(e) => e.stopPropagation()}>
          <IconButton icon={KebabHorizontalIcon} aria-label="Options" variant="invisible" size="small" />
        </span>
      </div>
    </div>
  );
}
