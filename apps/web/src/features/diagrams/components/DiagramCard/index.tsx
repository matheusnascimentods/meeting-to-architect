import { useState } from "react";
import { ActionMenu, ActionList, IconButton, Label } from "@primer/react";
import { KebabHorizontalIcon, PencilIcon, TrashIcon } from "@primer/octicons-react";
import { Diagram } from "../../types";
import { EditDiagramDialog } from "../EditDiagramDialog";
import { diagramService } from "../../services/diagram.service";
import "./styles.css";

interface DiagramCardProps {
  diagram: Diagram;
  onOpen: () => void;
  onUpdate?: (updated: Diagram) => void;
  onDelete?: (id: string | number) => void;
}

export function DiagramCard({ diagram, onOpen, onUpdate, onDelete }: DiagramCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { title, description } = diagram;
  const type = diagram.type || "Diagram";
  const variant = diagram.variant || "accent";
  const date = diagram.created_at ? new Date(diagram.created_at).toLocaleDateString() : "Just now";

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this diagram?")) {
      try {
        await diagramService.delete(diagram.id);
        onDelete?.(diagram.id);
      } catch (err) {
        console.error("Failed to delete diagram", err);
      }
    }
  };

  return (
    <>
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
          <ActionMenu>
            <ActionMenu.Anchor>
              <IconButton icon={KebabHorizontalIcon} aria-label="Options" variant="invisible" size="small" />
            </ActionMenu.Anchor>
            <ActionMenu.Overlay>
              <ActionList>
                <ActionList.Item onSelect={() => setIsEditDialogOpen(true)}>
                  <ActionList.LeadingVisual>
                    <PencilIcon />
                  </ActionList.LeadingVisual>
                  Editar
                </ActionList.Item>
                <ActionList.Item variant="danger" onSelect={handleDelete}>
                  <ActionList.LeadingVisual>
                    <TrashIcon />
                  </ActionList.LeadingVisual>
                  Excluir
                </ActionList.Item>
              </ActionList>
            </ActionMenu.Overlay>
          </ActionMenu>
        </span>
      </div>
      </div>
      {isEditDialogOpen && (
        <EditDiagramDialog
          diagram={diagram}
          onClose={() => setIsEditDialogOpen(false)}
          onSave={async (updated) => {
            try {
              const data = await diagramService.update(diagram.id, updated);
              onUpdate?.(data);
              setIsEditDialogOpen(false);
            } catch (err) {
              console.error("Failed to update diagram", err);
            }
          }}
        />
      )}
    </>
  );
}
