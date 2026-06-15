import { useState } from "react";
import { Label, Button, IconButton, Box } from "@primer/react";
import { ClockIcon, PersonIcon, CopyIcon, DownloadIcon, TrashIcon, ScreenFullIcon, XIcon, PencilIcon } from "@primer/octicons-react";
import { Diagram } from "@/features/diagrams/types";
import { PanelBox } from "@/shared/components/PanelBox";
import { PanelHeader } from "@/shared/components/PanelHeader";
import { DeleteDiagramDialog } from "@/features/diagrams/components/DeleteDiagramDialog";
import { EditDiagramDialog } from "../EditDiagramDialog";
import { diagramService } from "@/features/diagrams/services";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { useTeams } from "@/features/teams/hooks/use-teams";
import { MermaidPreview } from "../MermaidPreview";
import { tokens } from "@/shared/constants";
import { formatRelativeTime } from "@/shared/utils";
import { useToast } from "@/shared/hooks/use-toast";
import mermaid from "mermaid";
import { DiagramDetailProps } from "./index.types";
import styles from "./index.module.css";

export function DiagramDetail({ diagram, onDelete }: DiagramDetailProps) {
  const [source, setSource] = useState(diagram.mermaid_code);
  const [currentDiagram, setCurrentDiagram] = useState(diagram);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { success, error: toastError } = useToast();
  const { user } = useAuth();
  const { teams } = useTeams();

  const isCreator = user?.id === currentDiagram.created_by;
  const teamMembership = teams.find(t => t.team_id === currentDiagram.team_id);
  const canManage = isCreator || teamMembership?.role === 'admin' || teamMembership?.role === 'maintainer';

  const handleDelete = async () => {
    try {
      await diagramService.deleteDiagram(currentDiagram.id);
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
      const { svg } = await mermaid.render(`export-${currentDiagram.id.replace(/-/g, '')}`, source);
      const blob = new Blob([svg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${currentDiagram.title.toLowerCase().replace(/\s+/g, '-')}.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      success("Diagram exported as SVG!");
    } catch (err) {
      toastError("Failed to export diagram.");
    }
  };

  return (
    <>
      <div className={styles['diagram-detail-container']}>
        <div className={styles['diagram-detail-type']}>
          <Label variant={currentDiagram.variant || "accent"}>{currentDiagram.type || "Sequence"}</Label>
        </div>
        <h1 className={styles['diagram-detail-title']}>
          {currentDiagram.title}
        </h1>
        <div className={styles['diagram-detail-meta']}>
          <span className={styles['meta-item']}>
            <ClockIcon size={14} />
            <span>{currentDiagram.created_at ? `Generated ${formatRelativeTime(currentDiagram.created_at)}` : 'Date unknown'}</span>
          </span>
          <span>·</span>
          <span className={styles['meta-item']}>
            <PersonIcon size={14} />
            <span>{currentDiagram.creator?.name || currentDiagram.created_by || 'System Agent'}</span>
          </span>
        </div>
        <div className={styles['diagram-detail-actions']}>
          <Button leadingVisual={CopyIcon} onClick={handleCopy}>Copy Mermaid</Button>
          <Button leadingVisual={DownloadIcon} onClick={handleExport}>Export</Button>
          {canManage && (
            <>
              <Button leadingVisual={PencilIcon} onClick={() => setIsEditDialogOpen(true)}>Edit</Button>
              <Button variant="danger" leadingVisual={TrashIcon} onClick={() => setIsDeleteDialogOpen(true)}>Delete</Button>
            </>
          )}
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
              className={styles['diagram-preview-clickable']}
              onClick={() => setIsFullscreen(true)}
              title="Click to expand"
            >
              <MermaidPreview source={source} id={String(currentDiagram.id)} />
            </div>
          </PanelBox>

          <PanelBox>
            <PanelHeader
              left={<span className="panel-label">Mermaid Source</span>}
              right={<IconButton icon={CopyIcon} aria-label="Copy source" variant="invisible" size="small" onClick={handleCopy} />}
            />
            <pre className={styles['mermaid-source']}>
              <code>
                {source}
              </code>
            </pre>
          </PanelBox>
        </div>
      </div>

      {isFullscreen && (
        <div className={styles['diagram-fullscreen-overlay']} onClick={() => setIsFullscreen(false)}>
          <div className={styles['diagram-fullscreen-header']}>
            <span className={styles['diagram-fullscreen-title']}>{currentDiagram.title}</span>
            <IconButton
              icon={XIcon}
              aria-label="Close fullscreen"
              variant="invisible"
              size="medium"
              onClick={() => setIsFullscreen(false)}
              sx={{ color: '#fff' }}
            />
          </div>
          <div className={styles['diagram-fullscreen-content']} onClick={(e) => e.stopPropagation()}>
            <MermaidPreview source={source} id={`${currentDiagram.id}-fullscreen`} />
          </div>
        </div>
      )}

      {isEditDialogOpen && (
        <EditDiagramDialog
          diagram={currentDiagram}
          onClose={() => setIsEditDialogOpen(false)}
          onSave={async (updated) => {
            try {
              const data = await diagramService.update(currentDiagram.id, updated);
              setCurrentDiagram(data);
              setSource(data.mermaid_code);
              success('Diagram updated successfully.');
              setIsEditDialogOpen(false);
            } catch (err) {
              toastError('Failed to update diagram.');
            }
          }}
        />
      )}

      {isDeleteDialogOpen && (
        <DeleteDiagramDialog
          diagram={currentDiagram}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
}
