import { api } from "@/shared/lib/api";
import { Diagram } from "../types";
import { normalizeDiagrams } from "../utils/normalize-diagram";

export const trashService = {
  getTrash: async (): Promise<Diagram[]> => {
    const { data } = await api.get('/trash');
    return normalizeDiagrams(data);
  },

  restoreDiagram: async (id: string): Promise<void> => {
    await api.patch(`/trash/${id}/restore`);
  },

  permanentDeleteDiagram: async (id: string): Promise<void> => {
    await api.delete(`/trash/${id}`);
  },
};
