import { useState, useEffect, useCallback } from 'react';
import { trashService } from '../services/trash.service';
import { Diagram } from '../types';
import { COPY } from '@/shared/constants/copy';

export function useTrash() {
  const [items, setItems] = useState<Diagram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrash = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await trashService.getTrash();
      setItems(data);
    } catch (err) {
      setError(COPY.trash.error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrash();
  }, [fetchTrash]);

  const restore = async (id: string) => {
    await trashService.restoreDiagram(id);
    await fetchTrash();
  };

  const permanentDelete = async (id: string) => {
    await trashService.permanentDeleteDiagram(id);
    await fetchTrash();
  };

  return { items, loading, error, refetch: fetchTrash, restore, permanentDelete };
}
