import { Diagram } from "../../types";
import { UserTeam } from "@/features/teams/types";

export interface DiagramCardProps {
  diagram: Diagram;
  onOpen: () => void;
  onUpdate?: (updated: Diagram) => void;
  onDelete?: (id: string) => void;
  userTeams?: UserTeam[];
  refreshKey?: number;
  isTeamView?: boolean;
}
