import { api } from "@/shared/lib/api";
import { Diagram } from "../types";

export const diagramService = {
  update: async (id: string | number, data: Partial<Diagram>) => {
    const response = await api.patch(`/diagrams/${id}`, data);
    return response.data;
  },

  delete: async (id: string | number) => {
    const response = await api.delete(`/diagrams/${id}`);
    return response.data;
  },

  findAll: async () => {
    const response = await api.get("/diagrams");
    return response.data;
  }
};
