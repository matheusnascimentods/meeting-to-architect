import { api } from "@/shared/services";
import { Diagram } from "../../types";
import { normalizeDiagrams } from "../../utils";

export const teamDiagramService = {
  findByTeam: async (teamId: string): Promise<Diagram[]> => {
    const { data } = await api.get(`/team-diagrams/team/${teamId}`);
    return normalizeDiagrams(data);
  },

  addToTeam: async (diagramId: string, teamId: string): Promise<void> => {
    await api.post(`/team-diagrams/${diagramId}/add-to-team`, { team_id: teamId });
  },

  removeFromTeam: async (diagramId: string): Promise<void> => {
    await api.delete(`/team-diagrams/${diagramId}/remove-from-team`);
  },
};
