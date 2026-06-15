import { TeamInvite } from '../../../types';

export interface InviteItemProps {
  invite: TeamInvite;
  onRespond: (id: string, accept: boolean) => void;
}
