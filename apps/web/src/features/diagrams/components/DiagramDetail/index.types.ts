import { Diagram } from "@/features/diagrams/types";

export interface DiagramDetailProps {
  diagram: Diagram;
  onDelete?: () => void;
}
