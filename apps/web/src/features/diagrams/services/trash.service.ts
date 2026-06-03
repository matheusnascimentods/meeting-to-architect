import { api } from "@/shared/lib/api";
import { Diagram } from "../types";

export const trashService = {
  getTrash: async (): Promise<Diagram[]> => {
    const { data } = await api.get('/trash')
    return data
  },

  restoreDiagram: async (id: string): Promise<void> => {
    await api.patch(`/trash/${id}/restore`)
  },

  permanentDeleteDiagram: async (id: string): Promise<void> => {
    await api.delete(`/trash/${id}`)
  },
};
