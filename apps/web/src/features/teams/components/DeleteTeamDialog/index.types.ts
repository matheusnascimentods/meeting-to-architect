import { Team } from "@/features/teams/types";

export interface DeleteTeamDialogProps {
  team: Team;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}
