import { useState } from "react";
import { ActionMenu, ActionList, IconButton, Label } from "@primer/react";
import { KebabHorizontalIcon, PencilIcon, TrashIcon } from "@primer/octicons-react";
import { Diagram } from "../../types";
import { EditDiagramDialog } from "../EditDiagramDialog";
import { DeleteDiagramDialog } from "@/shared/components/DeleteDiagramDialog";
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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { title, description } = diagram;
  const type = diagram.type || "Diagram";
  const variant = diagram.variant || "accent";
  const date = diagram.createdAt ? new Date(diagram.createdAt).toLocaleDateString() : "Just now";

  const handleDelete = async () => {
    console.log("Sending delete request for diagram:", diagram.id);
    try {
      await diagramService.delete(diagram.id);
      onDelete?.(diagram.id);
      setIsDeleteDialogOpen(false);
    } catch (err) {
      console.error("Failed to delete diagram", err);
      throw err; // Re-throw to allow DeleteDiagramDialog to handle loading state
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
                    Edit
                  </ActionList.Item>
                  <ActionList.Item variant="danger" onSelect={() => setIsDeleteDialogOpen(true)}>
                    <ActionList.LeadingVisual>
                      <TrashIcon />
                    </ActionList.LeadingVisual>
                    Delete
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
      {isDeleteDialogOpen && (
        <DeleteDiagramDialog
          diagram={diagram}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
}
