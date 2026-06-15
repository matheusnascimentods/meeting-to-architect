import { useState, useEffect, useCallback } from 'react';
import { diagramService } from '../../services';
import { approvalService } from '../../services';
import { Diagram } from '../../types';
import { COPY } from '@/shared/constants';
import { useToast } from '@/shared/hooks/use-toast';

export function useDiagrams() {
  const [diagrams, setDiagrams] = useState<Diagram[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { success, error: toastError } = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [diagramsData, requestsData] = await Promise.all([
        diagramService.findAll(),
        approvalService.getMyRequests()
      ]);
      setDiagrams(diagramsData);
      setRequests(requestsData);
    } catch (err) {
      setError(COPY.diagrams.error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const cancelRequest = async (requestId: string) => {
    try {
      await approvalService.cancelRequest(requestId);
      success("Request cancelled successfully.");
      await fetchData();
    } catch (err) {
      toastError("Failed to cancel request.");
    }
  };

  return { diagrams, requests, loading, error, refetch: fetchData, cancelRequest };
}
