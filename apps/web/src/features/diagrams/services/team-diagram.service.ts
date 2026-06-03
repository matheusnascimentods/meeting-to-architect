import { api } from "@/shared/lib/api";
import { Diagram } from "../types";

export const teamDiagramService = {
  findByTeam: async (teamId: string): Promise<Diagram[]> => {
    const { data } = await api.get(`/team-diagrams/team/${teamId}`)
    return data
  },

  addToTeam: async (diagramId: string, teamId: string): Promise<void> => {
    await api.post(`/team-diagrams/${diagramId}/add-to-team`, { team_id: teamId });
  },
};
