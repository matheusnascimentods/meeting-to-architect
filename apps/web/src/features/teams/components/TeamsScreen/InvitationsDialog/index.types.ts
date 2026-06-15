import { TeamInvite } from '../../../types';

export interface InvitationsDialogProps {
  invites: TeamInvite[];
  onClose: () => void;
  onRespond: (id: string, accept: boolean) => void;
}
