import { Team } from "../../../types";

export interface EditTeamDialogProps {
  team: Team;
  onClose: () => void;
  onSuccess: () => void;
}
