import { useState } from "react";
import { Dialog, FormControl, TextInput, Textarea } from "@primer/react";
import { Diagram } from "../../types";

interface EditDiagramDialogProps {
  diagram: Diagram;
  onClose: () => void;
  onSave: (updated: Partial<Diagram>) => void;
}

export function EditDiagramDialog({ diagram, onClose, onSave }: EditDiagramDialogProps) {
  const [title, setTitle] = useState(diagram.title);
  const [description, setDescription] = useState(diagram.description || "");
  const [code, setCode] = useState(diagram.data || "");

  const handleSave = () => {
    onSave({ title, description, data: code });
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

        <FormControl>
          <FormControl.Label>Diagram Code (Mermaid)</FormControl.Label>
          <Textarea 
            block 
            value={code} 
            onChange={(e) => setCode(e.target.value)} 
            rows={15} 
            style={{ fontFamily: 'monospace', whiteSpace: 'pre' }} 
            resize="vertical"
          />
        </FormControl>
      </div>
    </Dialog>
  );
}
