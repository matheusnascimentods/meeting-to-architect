import { Team } from "../../types";

export interface NewTeamDialogProps {
  onClose: () => void;
  onSuccess?: (team: Team) => void;
}
