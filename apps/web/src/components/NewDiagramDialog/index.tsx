import { useState } from "react";
import { Dialog, FormControl, Button, IconButton } from "@primer/react";
import { FileIcon, XIcon, UploadIcon, ArrowSwitchIcon, PackageIcon, CodeSquareIcon } from "@primer/octicons-react";
import { DiagramType } from "../../types";
import "./styles.css";

const diagramTypes: { id: DiagramType; icon: React.ComponentType<any>; title: string; description: string }[] = [
  { id: "sequence", icon: ArrowSwitchIcon, title: "Sequence", description: "Interactions between components over time" },
  { id: "c4", icon: PackageIcon, title: "C4 Model", description: "System context, containers and components" },
  { id: "class", icon: CodeSquareIcon, title: "Class", description: "Object structure and relationships" },
];

interface NewDiagramDialogProps {
  onClose: () => void;
}

export function NewDiagramDialog({ onClose }: NewDiagramDialogProps) {
  const [hasFile, setHasFile] = useState(false);
  const [selectedType, setSelectedType] = useState<DiagramType | null>(null);
  const canGenerate = hasFile && selectedType !== null;

  return (
    <Dialog
      title="New Diagram"
      subtitle="Upload a meeting transcript and choose the diagram type to generate."
      onClose={onClose}
      width="xlarge"
      footerButtons={[
        { content: "Cancel", buttonType: "default", onClick: onClose },
        {
          content: "Generate Diagram",
          buttonType: "primary",
          disabled: !canGenerate,
          onClick: () => canGenerate && onClose(),
        },
      ]}
    >
      <div className="new-diagram-dialog">
        <FormControl>
          <FormControl.Label>Transcript File</FormControl.Label>
          {hasFile ? (
            <div className="file-preview">
              <div className="file-info">
                <FileIcon size={18} />
                <span className="file-name">meeting_transcript.vtt</span>
              </div>
              <IconButton
                icon={XIcon}
                aria-label="Remove file"
                variant="invisible"
                size="small"
                onClick={() => setHasFile(false)}
              />
            </div>
          ) : (
            <div className="file-upload">
              <UploadIcon size={32} fill="#6E6E73" />
              <div className="upload-title">Drag and drop your transcript file</div>
              <div className="upload-subtitle">.txt, .vtt or .srt — max 10MB</div>
              <Button size="small" onClick={() => setHasFile(true)}>Browse file</Button>
            </div>
          )}
        </FormControl>

        <FormControl>
          <FormControl.Label>Diagram Type</FormControl.Label>
          <FormControl.Caption>Select the type of architecture diagram to generate from the transcript.</FormControl.Caption>
          <div className="m2a-types diagram-types-grid">
            {diagramTypes.map((t) => {
              const selected = selectedType === t.id;
              return (
                <div
                  key={t.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedType(t.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedType(t.id);
                    }
                  }}
                  className={`diagram-type-card ${selected ? 'selected' : ''}`}
                >
                  <span className="diagram-type-icon"><t.icon size={20} /></span>
                  <div className="diagram-type-title">{t.title}</div>
                  <div className="diagram-type-description">{t.description}</div>
                </div>
              );
            })}
          </div>
        </FormControl>
      </div>
    </Dialog>
  );
}
