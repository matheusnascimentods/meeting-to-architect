import { api } from "@/shared/services";
import { Diagram } from "../../types";
import { normalizeDiagram, normalizeDiagrams } from "../../utils";

export const diagramService = {
  update: async (id: string, data: Partial<Diagram>) => {
    const response = await api.patch(`/diagrams/${id}`, data);
    return normalizeDiagram(response.data);
  },

  deleteDiagram: async (id: string): Promise<void> => {
    await api.delete(`/diagrams/${id}`);
  },

  findAll: async (): Promise<Diagram[]> => {
    const response = await api.get("/diagrams");
    return normalizeDiagrams(response.data);
  },
};
