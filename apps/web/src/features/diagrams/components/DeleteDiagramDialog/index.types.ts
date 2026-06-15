import { Diagram } from "@/features/diagrams/types";

export interface DeleteDiagramDialogProps {
  diagram: Diagram;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}
