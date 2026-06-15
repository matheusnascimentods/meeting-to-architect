import { Diagram } from "../../types";

export interface EditDiagramDialogProps {
  diagram: Diagram;
  onClose: () => void;
  onSave: (updated: Partial<Diagram>) => void;
}
