import { useState, useRef } from "react";
import { Dialog, FormControl, Button, IconButton, Flash, Spinner } from "@primer/react";
import { FileIcon, XIcon, UploadIcon, ArrowSwitchIcon, PackageIcon, CodeSquareIcon } from "@primer/octicons-react";
import { DiagramType } from "../../types";
import { api } from "../../lib/api";
import "./styles.css";

const diagramTypes: { id: DiagramType; icon: React.ComponentType<any>; title: string; description: string }[] = [
  { id: "sequence", icon: ArrowSwitchIcon, title: "Sequence", description: "Interactions between components over time" },
  { id: "c4", icon: PackageIcon, title: "C4 Model", description: "System context, containers and components" },
  { id: "class", icon: CodeSquareIcon, title: "Class", description: "Object structure and relationships" },
];

interface NewDiagramDialogProps {
  onClose: () => void;
  onSuccess?: (diagram: any) => void;
}

export function NewDiagramDialog({ onClose, onSuccess }: NewDiagramDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [selectedType, setSelectedType] = useState<DiagramType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canGenerate = file !== null && selectedType !== null && !loading;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const ext = selectedFile.name.split('.').pop()?.toLowerCase();
      if (ext === 'pdf' || ext === 'md') {
        setFile(selectedFile);
        setError(null);
      } else {
        setError("Only PDF and MD files are allowed.");
      }
    }
  };

  const handleGenerate = async () => {
    if (!canGenerate) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("diagramType", selectedType);

    try {
      const response = await api.post("/agents/generate", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      if (onSuccess) {
        onSuccess(response.data);
      }
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to generate diagram. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      title="New Diagram"
      subtitle="Upload a meeting transcript and choose the diagram type to generate."
      onClose={onClose}
      width="xlarge"
      footerButtons={[
        { content: "Cancel", buttonType: "default", onClick: onClose, disabled: loading },
        {
          content: loading ? "Generating..." : "Generate Diagram",
          buttonType: "primary",
          disabled: !canGenerate,
          onClick: handleGenerate,
        },
      ]}
    >
      <div className="new-diagram-dialog">
        {error && (
          <Flash variant="danger" sx={{ mb: 3 }}>
            {error}
          </Flash>
        )}

        <FormControl>
          <FormControl.Label>Transcript File</FormControl.Label>
          {file ? (
            <div className="file-preview">
              <div className="file-info">
                <FileIcon size={18} />
                <span className="file-name">{file.name}</span>
              </div>
              <IconButton
                icon={XIcon}
                aria-label="Remove file"
                variant="invisible"
                size="small"
                onClick={() => setFile(null)}
                disabled={loading}
              />
            </div>
          ) : (
            <div className="file-upload" onClick={() => fileInputRef.current?.click()}>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept=".pdf,.md"
                onChange={handleFileChange}
              />
              <UploadIcon size={32} fill="#6E6E73" />
              <div className="upload-title">Click to upload your transcript file</div>
              <div className="upload-subtitle">.pdf or .md — max 10MB</div>
              <Button size="small" disabled={loading}>Browse file</Button>
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
                  onClick={() => !loading && setSelectedType(t.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      if (!loading) setSelectedType(t.id);
                    }
                  }}
                  className={`diagram-type-card ${selected ? 'selected' : ''} ${loading ? 'disabled' : ''}`}
                >
                  <span className="diagram-type-icon"><t.icon size={20} /></span>
                  <div className="diagram-type-title">{t.title}</div>
                  <div className="diagram-type-description">{t.description}</div>
                </div>
              );
            })}
          </div>
        </FormControl>

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px', gap: '10px', alignItems: 'center' }}>
            <Spinner size="small" />
            <span style={{ color: '#6E6E73', fontSize: '14px' }}>This may take a minute...</span>
          </div>
        )}
      </div>
    </Dialog>
  );
}
