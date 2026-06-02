import { useState, useEffect, useCallback } from 'react';
import { diagramService } from '../services/diagram.service';
import { Diagram } from '../types';
import { COPY } from '@/shared/constants/copy';

export function useDiagrams() {
  const [diagrams, setDiagrams] = useState<Diagram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDiagrams = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await diagramService.findAll();
      setDiagrams(data);
    } catch (err) {
      setError(COPY.diagrams.error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDiagrams();
  }, [fetchDiagrams]);

  return { diagrams, loading, error, refetch: fetchDiagrams };
}
