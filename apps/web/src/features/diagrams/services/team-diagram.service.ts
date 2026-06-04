import { api } from "@/shared/lib/api";
import { Diagram } from "../types";
import { normalizeDiagrams } from "../utils/normalize-diagram";

export const teamDiagramService = {
  findByTeam: async (teamId: string): Promise<Diagram[]> => {
    const { data } = await api.get(`/team-diagrams/team/${teamId}`);
    return normalizeDiagrams(data);
  },

  addToTeam: async (diagramId: string, teamId: string): Promise<void> => {
    await api.post(`/team-diagrams/${diagramId}/add-to-team`, { team_id: teamId });
  },
};
