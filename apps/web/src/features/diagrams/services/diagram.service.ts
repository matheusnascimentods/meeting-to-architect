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
};
