import { useState, useEffect, useCallback } from 'react';
import { teamService } from '../../services';
import { inviteService } from '../../services';
import { UserTeam, TeamInvite } from '../../types';
import { COPY } from '@/shared/constants';
import { useToast } from '@/shared/hooks/use-toast';

export function useTeams() {
  const [teams, setTeams] = useState<UserTeam[]>([]);
  const [invites, setInvites] = useState<TeamInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { success, error: toastError } = useToast();

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
    try {
      await inviteService.respondInvite(inviteId, accept);
      success(accept ? "Invite accepted." : "Invite rejected.");
      await fetchData();
    } catch (err) {
      toastError("Failed to respond to invite.");
    }
  };

  return { teams, invites, loading, error, refetch: fetchData, respondInvite };
}
