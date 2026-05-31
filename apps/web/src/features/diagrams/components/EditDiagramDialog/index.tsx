import { useState } from "react";
import { Dialog, FormControl, TextInput, Textarea, SegmentedControl } from "@primer/react";
import { Diagram } from "../../types";
import { MermaidPreview } from "../MermaidPreview";

interface EditDiagramDialogProps {
  diagram: Diagram;
  onClose: () => void;
  onSave: (updated: Partial<Diagram>) => void;
}

export function EditDiagramDialog({ diagram, onClose, onSave }: EditDiagramDialogProps) {
  const [title, setTitle] = useState(diagram.title);
  const [description, setDescription] = useState(diagram.description || "");
  const [code, setCode] = useState(diagram.mermaid_code || "");
  const [view, setView] = useState<"code" | "preview">("code");

  const handleSave = () => {
    onSave({ title, description, mermaid_code: code });
  };

  return (
    <Dialog
      title="Edit Diagram"
      subtitle="Update the details and code of your diagram."
      onClose={onClose}
      width="xlarge"
      footerButtons={[
        { content: "Cancel", buttonType: "default", onClick: onClose },
        { content: "Save Changes", buttonType: "primary", onClick: handleSave },
      ]}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
        <FormControl>
          <FormControl.Label>Title</FormControl.Label>
          <TextInput block value={title} onChange={(e) => setTitle(e.target.value)} />
        </FormControl>

        <FormControl>
          <FormControl.Label>Description</FormControl.Label>
          <Textarea block value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
        </FormControl>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', width: '100%' }}>
          <span style={{ fontWeight: 600, fontSize: '14px' }}>Diagram Code (Mermaid)</span>
          <SegmentedControl aria-label="View mode">
            <SegmentedControl.Button selected={view === "code"} onClick={() => setView("code")}>
              Code
            </SegmentedControl.Button>
            <SegmentedControl.Button selected={view === "preview"} onClick={() => setView("preview")}>
              Preview
            </SegmentedControl.Button>
          </SegmentedControl>
        </div>

        <div style={{ height: '350px', marginTop: '12px' }}>
          {view === "code" ? (
            <Textarea
              block
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={15}
              style={{ fontFamily: 'monospace', whiteSpace: 'pre', height: '100%' }}
              resize="none"
            />
          ) : (
            <div style={{ border: '1px solid var(--borderColor-default, #d0d7de)', borderRadius: '6px', padding: '16px', height: '100%', overflow: 'auto', backgroundColor: 'var(--bgColor-muted, #f6f8fa)' }}>
              <MermaidPreview source={code} id={`edit-${diagram.id}`} />
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
}
