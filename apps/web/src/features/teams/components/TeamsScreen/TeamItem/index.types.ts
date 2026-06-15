import { UserTeam } from '../../../types';

export interface TeamItemProps {
  userTeam: UserTeam;
  onClick: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onMembers?: () => void;
}
