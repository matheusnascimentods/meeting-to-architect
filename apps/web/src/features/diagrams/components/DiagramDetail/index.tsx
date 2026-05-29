import { Label, Button, IconButton } from "@primer/react";
import { ClockIcon, PersonIcon, CopyIcon, DownloadIcon, TrashIcon } from "@primer/octicons-react";
import { Diagram } from "@/features/diagrams/types";
import { PanelBox } from "@/shared/components/PanelBox";
import { PanelHeader } from "@/shared/components/PanelHeader";
import { MermaidPreview } from "../MermaidPreview";
import "./styles.css";

interface DiagramDetailProps {
  diagram: Diagram;
}

export function DiagramDetail({ diagram }: DiagramDetailProps) {
  const source = diagram.data;

  return (
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
          <span>{diagram.createdByUser || 'System Agent'}</span>
        </span>
      </div>
      <div className="diagram-detail-actions">
        <Button leadingVisual={CopyIcon} onClick={() => navigator.clipboard.writeText(source)}>Copy Mermaid</Button>
        <Button leadingVisual={DownloadIcon}>Export</Button>
        <Button variant="danger" leadingVisual={TrashIcon}>Delete</Button>
      </div>

      <div className="m2a-detail-grid">
        <PanelBox>
          <PanelHeader
            left={<span className="panel-label">Preview</span>}
            right={<Label>Mermaid</Label>}
          />
          <MermaidPreview source={source} id={String(diagram.id)} />
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
  );
}
