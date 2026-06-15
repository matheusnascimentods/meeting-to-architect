import { Diagram } from '../../../types';

export interface TrashItemProps {
  diagram: Diagram;
  onRestore: (id: string) => void;
  onDelete: (diagram: Diagram) => void;
}
