import { api } from "@/shared/lib/api";
import { Diagram } from "../types";

export const diagramService = {
  update: async (id: string, data: Partial<Diagram>) => {
    const response = await api.patch(`/diagrams/${id}`, data);
    return response.data;
  },

  deleteDiagram: async (id: string): Promise<void> => {
    await api.delete(`/diagrams/${id}`);
  },

  findAll: async () => {
    const response = await api.get("/diagrams");
    return response.data;
  },

  getTrash: async (): Promise<Diagram[]> => {
    const { data } = await api.get('/diagrams/trash')
    return data
  },

  permanentDeleteDiagram: async (id: string): Promise<void> => {
    await api.delete(`/diagrams/${id}/permanent`)
  },

  restoreDiagram: async (id: string): Promise<void> => {
    await api.patch(`/diagrams/${id}/restore`)
  },

  findByTeam: async (teamId: string): Promise<Diagram[]> => {
    const { data } = await api.get(`/diagrams/team/${teamId}`)
    return data
  },

  addToTeam: async (diagramId: string, teamId: string): Promise<void> => {
    await api.post(`/diagrams/${diagramId}/add-to-team`, { team_id: teamId });
  },

  getTeamRequests: async (teamId: string): Promise<any[]> => {
    const { data } = await api.get(`/diagrams/team/${teamId}/requests`);
    return data;
  },

  respondRequest: async (requestId: string, approve: boolean): Promise<void> => {
    await api.patch(`/diagrams/requests/${requestId}/respond`, { approve });
  },
};
