import { useState } from "react";
import { Label, Button, IconButton } from "@primer/react";
import { ClockIcon, PersonIcon, CopyIcon, DownloadIcon, TrashIcon, ScreenFullIcon, XIcon } from "@primer/octicons-react";
import { Diagram } from "@/features/diagrams/types";
import { PanelBox } from "@/shared/components/PanelBox";
import { PanelHeader } from "@/shared/components/PanelHeader";
import { DeleteDiagramDialog } from "@/shared/components/DeleteDiagramDialog";
import { diagramService } from "@/features/diagrams/services/diagram.service";
import { MermaidPreview } from "../MermaidPreview";
import "./styles.css";

interface DiagramDetailProps {
  diagram: Diagram;
  onDelete?: () => void;
}

export function DiagramDetail({ diagram, onDelete }: DiagramDetailProps) {
  const source = diagram.mermaid_code;
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await diagramService.deleteDiagram(diagram.id);
      onDelete?.();
    } catch (err) {
      console.error("Failed to delete diagram:", err);
      throw err;
    }
  };

  return (
    <>
      <div className="diagram-detail-container">
        <div className="diagram-detail-type">
          <Label variant={diagram.variant || "accent"}>{diagram.type || "Sequence"}</Label>
        </div>
        <h1 className="diagram-detail-title">
          {diagram.title}
        </h1>
        <div className="diagram-detail-meta">
          <span className="meta-item">
            <ClockIcon size={14} />
            <span>{diagram.created_at ? `Generated ${new Date(diagram.created_at).toLocaleDateString()}` : 'Date unknown'}</span>
          </span>
          <span>·</span>
          <span className="meta-item">
            <PersonIcon size={14} />
            <span>{diagram.created_by || 'System Agent'}</span>
          </span>
        </div>
        <div className="diagram-detail-actions">
          <Button leadingVisual={CopyIcon} onClick={() => navigator.clipboard.writeText(source)}>Copy Mermaid</Button>
          <Button leadingVisual={DownloadIcon}>Export</Button>
          <Button variant="danger" leadingVisual={TrashIcon} onClick={() => setIsDeleteDialogOpen(true)}>Delete</Button>
        </div>

        <div className="m2a-detail-grid">
          <PanelBox>
            <PanelHeader
              left={<span className="panel-label">Preview</span>}
              right={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Label>Mermaid</Label>
                  <IconButton
                    icon={ScreenFullIcon}
                    aria-label="Fullscreen"
                    variant="invisible"
                    size="small"
                    onClick={() => setIsFullscreen(true)}
                  />
                </div>
              }
            />
            <div
              className="diagram-preview-clickable"
              onClick={() => setIsFullscreen(true)}
              title="Click to expand"
            >
              <MermaidPreview source={source} id={String(diagram.id)} />
            </div>
          </PanelBox>

          <PanelBox>
            <PanelHeader
              left={<span className="panel-label">Mermaid Source</span>}
              right={<IconButton icon={CopyIcon} aria-label="Copy source" variant="invisible" size="small" onClick={() => navigator.clipboard.writeText(source)} />}
            />
            <pre className="mermaid-source">
              <code>
                {source}
              </code>
            </pre>
          </PanelBox>
        </div>
      </div>

      {isFullscreen && (
        <div className="diagram-fullscreen-overlay" onClick={() => setIsFullscreen(false)}>
          <div className="diagram-fullscreen-header">
            <span className="diagram-fullscreen-title">{diagram.title}</span>
            <IconButton
              icon={XIcon}
              aria-label="Close fullscreen"
              variant="invisible"
              size="medium"
              onClick={() => setIsFullscreen(false)}
              sx={{ color: '#fff' }}
            />
          </div>
          <div className="diagram-fullscreen-content" onClick={(e) => e.stopPropagation()}>
            <MermaidPreview source={source} id={`${diagram.id}-fullscreen`} />
          </div>
        </div>
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
