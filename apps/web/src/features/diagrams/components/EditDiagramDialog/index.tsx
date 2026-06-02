import { useState } from "react";
import { Dialog, FormControl, TextInput, Textarea, SegmentedControl, Box, Text } from "@primer/react";
import { Diagram } from "../../types";
import { MermaidPreview } from "../MermaidPreview";
import { COPY } from "@/shared/constants/copy";

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
        { content: COPY.common.cancel, buttonType: "default", onClick: onClose },
        { content: COPY.common.save, buttonType: "primary", onClick: handleSave },
      ]}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 3 }}>
        <FormControl>
          <FormControl.Label>Title</FormControl.Label>
          <TextInput block value={title} onChange={(e) => setTitle(e.target.value)} />
        </FormControl>

        <FormControl>
          <FormControl.Label>Description</FormControl.Label>
          <Textarea block value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
        </FormControl>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3, width: '100%' }}>
          <Text sx={{ fontWeight: 600, fontSize: 1 }}>Diagram Code (Mermaid)</Text>
          <SegmentedControl aria-label="View mode">
            <SegmentedControl.Button selected={view === "code"} onClick={() => setView("code")}>
              Code
            </SegmentedControl.Button>
            <SegmentedControl.Button selected={view === "preview"} onClick={() => setView("preview")}>
              Preview
            </SegmentedControl.Button>
          </SegmentedControl>
        </Box>

        <Box sx={{ height: '350px', mt: 2 }}>
          {view === "code" ? (
            <Textarea
              block
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={15}
              sx={{ fontFamily: 'monospace', whiteSpace: 'pre', height: '100%' }}
              resize="none"
            />
          ) : (
            <Box sx={{ border: '1px solid', borderColor: 'border.default', borderRadius: 2, p: 3, height: '100%', overflow: 'auto', bg: 'canvas.subtle' }}>
              <MermaidPreview source={code} id={`edit-${diagram.id}`} />
            </Box>
          )}
        </Box>
      </Box>
    </Dialog>
  );
}
