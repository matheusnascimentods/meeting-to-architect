import { useState } from "react";
import { Label, Button, IconButton, Box } from "@primer/react";
import { ClockIcon, PersonIcon, CopyIcon, DownloadIcon, TrashIcon, ScreenFullIcon, XIcon } from "@primer/octicons-react";
import { Diagram } from "@/features/diagrams/types";
import { PanelBox } from "@/shared/components/PanelBox";
import { PanelHeader } from "@/shared/components/PanelHeader";
import { DeleteDiagramDialog } from "@/shared/components/DeleteDiagramDialog";
import { diagramService } from "@/features/diagrams/services/diagram.service";
import { MermaidPreview } from "../MermaidPreview";
import { tokens } from "@/shared/styles/tokens";
import { formatRelativeTime } from "@/shared/lib/date-utils";
import { useToast } from "@/shared/hooks/use-toast";
import mermaid from "mermaid";
import "./styles.css";

interface DiagramDetailProps {
  diagram: Diagram;
  onDelete?: () => void;
}

export function DiagramDetail({ diagram, onDelete }: DiagramDetailProps) {
  const source = diagram.mermaid_code;
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { success, error } = useToast();

  const handleDelete = async () => {
    try {
      await diagramService.deleteDiagram(diagram.id);
      onDelete?.();
    } catch (err) {
      // Re-throw to be handled by the dialog
      throw err;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(source);
    success("Mermaid code copied to clipboard!");
  };

  const handleExport = async () => {
    try {
      mermaid.initialize({
        startOnLoad: false,
        theme: "neutral",
        securityLevel: "loose",
      });
      const { svg } = await mermaid.render(`export-${diagram.id.replace(/-/g, '')}`, source);
      const blob = new Blob([svg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${diagram.title.toLowerCase().replace(/\s+/g, '-')}.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      success("Diagram exported as SVG!");
    } catch (err) {
      error("Failed to export diagram.");
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
            <span>{diagram.created_at ? `Generated ${formatRelativeTime(diagram.created_at)}` : 'Date unknown'}</span>
          </span>
          <span>·</span>
          <span className="meta-item">
            <PersonIcon size={14} />
            <span>{diagram.creator?.name || diagram.created_by || 'System Agent'}</span>
          </span>
        </div>
        <div className="diagram-detail-actions">
          <Button leadingVisual={CopyIcon} onClick={handleCopy}>Copy Mermaid</Button>
          <Button leadingVisual={DownloadIcon} onClick={handleExport}>Export</Button>
          <Button variant="danger" leadingVisual={TrashIcon} onClick={() => setIsDeleteDialogOpen(true)}>Delete</Button>
        </div>

        <div className="m2a-detail-grid">
          <PanelBox>
            <PanelHeader
              left={<span className="panel-label">Preview</span>}
              right={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Label>Mermaid</Label>
                  <IconButton
                    icon={ScreenFullIcon}
                    aria-label="Fullscreen"
                    variant="invisible"
                    size="small"
                    onClick={() => setIsFullscreen(true)}
                  />
                </Box>
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
              right={<IconButton icon={CopyIcon} aria-label="Copy source" variant="invisible" size="small" onClick={handleCopy} />}
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
