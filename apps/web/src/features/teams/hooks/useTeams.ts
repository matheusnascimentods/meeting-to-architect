import { useState, useEffect, useCallback } from 'react';
import { teamService } from '../services/team.service';
import { inviteService } from '../services/invite.service';
import { UserTeam, TeamInvite } from '../types';
import { COPY } from '@/shared/constants/copy';

export function useTeams() {
  const [teams, setTeams] = useState<UserTeam[]>([]);
  const [invites, setInvites] = useState<TeamInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [teamsData, invitesData] = await Promise.all([
        teamService.findAll(),
        inviteService.getMyInvites()
      ]);
      setTeams(teamsData);
      setInvites(invitesData);
    } catch (err) {
      setError(COPY.teams.error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const respondInvite = async (inviteId: string, accept: boolean) => {
    await inviteService.respondInvite(inviteId, accept);
    await fetchData();
  };

  return { teams, invites, loading, error, refetch: fetchData, respondInvite };
}
