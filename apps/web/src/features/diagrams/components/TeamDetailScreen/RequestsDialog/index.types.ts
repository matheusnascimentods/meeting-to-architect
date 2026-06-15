import { DiagramRequest } from '../../../types';

export interface RequestsDialogProps {
  requests: DiagramRequest[];
  onClose: () => void;
  onRespond: (id: string, approve: boolean) => void;
}
