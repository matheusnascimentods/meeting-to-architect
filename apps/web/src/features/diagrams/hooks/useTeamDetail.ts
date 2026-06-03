import { useState, useEffect, useCallback } from 'react';
import { teamService } from '@/features/teams/services/team.service';
import { inviteService } from '@/features/teams/services/invite.service';
import { teamDiagramService } from '@/features/diagrams/services/team-diagram.service';
import { approvalService } from '@/features/diagrams/services/approval.service';
import { Team } from '@/features/teams/types';
import { Diagram, DiagramRequest } from '@/features/diagrams/types';
import { COPY } from '@/shared/constants/copy';

export function useTeamDetail(teamId: string) {
  const [team, setTeam] = useState<Team | null>(null);
  const [role, setRole] = useState<string>('');
  const [diagrams, setDiagrams] = useState<Diagram[]>([]);
  const [requests, setRequests] = useState<DiagramRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!teamId) return;
    setLoading(true);
    setError(null);
    try {
      const [teamData, diagramsData, requestsData] = await Promise.all([
        teamService.findById(teamId),
        teamDiagramService.findByTeam(teamId),
        approvalService.getTeamRequests(teamId)
      ]);
      setTeam(teamData.Teams);
      setRole(teamData.role);
      setDiagrams(diagramsData);
      setRequests(requestsData);
    } catch (err) {
      setError(COPY.common.error);
    } finally {
      setLoading(false);
    }
  }, [teamId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const inviteMember = async (email: string) => {
    await inviteService.invite(teamId, email);
    await fetchData();
  };

  const respondRequest = async (requestId: string, approve: boolean) => {
    await approvalService.respondRequest(requestId, approve);
    await fetchData();
  };

  return { team, role, diagrams, requests, loading, error, refetch: fetchData, inviteMember, respondRequest };
}
