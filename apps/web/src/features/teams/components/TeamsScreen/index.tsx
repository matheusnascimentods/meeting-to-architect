import { useState, useEffect } from "react";
import { Box, Button, CounterLabel, Spinner, Text, Label, TextInput } from "@primer/react";
import { PeopleIcon, PlusIcon } from "@primer/octicons-react";
import { UserTeam } from "../../types";
import { teamService } from "../../services/team.service";
import { NewTeamDialog } from "../NewTeamDialog";
import { EmptyState } from "@/shared/components/EmptyState";
import { TeamDetailScreen } from "@/features/diagrams/components/TeamDetailScreen";

const fontStack = "system-ui, -apple-system, BlinkMacSystemFont, sans-serif";

type TeamsView =
  | { name: 'list' }
  | { name: 'detail'; team: { id: string; name: string } }

export function TeamsScreen() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [teamList, setTeamList] = useState<UserTeam[]>([]);
  const [invites, setInvites] = useState<any[]>([]);
  const [view, setView] = useState<TeamsView>({ name: 'list' })

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const [teamsData, invitesData] = await Promise.all([
        teamService.findAll(),
        teamService.getMyInvites()
      ]);
      setTeamList(teamsData);
      setInvites(invitesData);
    } catch (err) {
      console.error("Failed to fetch teams or invites", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleRespond = async (inviteId: string, accept: boolean) => {
    try {
      await teamService.respondInvite(inviteId, accept);
      fetchTeams();
    } catch (err) {
      console.error("Failed to respond to invite", err);
    }
  };

  if (view.name === 'detail') {
    return (
      <TeamDetailScreen
        team={view.team}
        onBack={() => setView({ name: 'list' })}
      />
    )
  }

  return (
    <Box sx={{ minHeight: "100vh", fontFamily: fontStack }}>
      <Box
        as="nav"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          padding: "16px 32px",
          background: "canvas.default",
          borderBottom: "1px solid",
          borderColor: "border.default",
        }}
      >
        <Button variant="primary" leadingVisual={PlusIcon} onClick={() => setIsOpen(true)}>
          New Team
        </Button>
      </Box>

      <Box sx={{ maxWidth: 1200, margin: "0 auto", padding: "40px 32px" }}>
        {invites.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Text as="h2" sx={{ fontSize: 2, fontWeight: 'bold', mb: 2 }}>
              Meus Convites
              <CounterLabel sx={{ ml: 2 }}>{invites.length}</CounterLabel>
            </Text>
            {invites.map((invite) => (
              <Box key={invite.id} sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 3,
                mb: 2,
                border: '1px solid',
                borderColor: 'border.default',
                borderRadius: 2,
                bg: 'canvas.default',
              }}>
                <Box>
                  <Text sx={{ fontWeight: 'bold', display: 'block' }}>{invite.Teams?.name}</Text>
                  <Text sx={{ color: 'fg.muted', fontSize: 0 }}>Você foi convidado para este time</Text>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button size="small" variant="primary" onClick={() => handleRespond(invite.id, true)}>
                    Aceitar
                  </Button>
                  <Button size="small" variant="danger" onClick={() => handleRespond(invite.id, false)}>
                    Recusar
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>
        )}

        <Box sx={{ display: "flex", alignItems: "center", gap: 2, marginBottom: 1 }}>
          <Text as="h1" sx={{ fontSize: 5, fontWeight: 'bold', letterSpacing: "-0.02em", margin: 0 }}>
            Teams
          </Text>
          {!loading && <CounterLabel>{teamList.length}</CounterLabel>}
        </Box>
        <Text as="p" sx={{ fontSize: 1, color: 'fg.muted', marginBottom: 4 }}>
          Collaborate with your colleagues on architecture diagrams
        </Text>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', padding: '100px', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <Spinner size="large" />
            <Text sx={{ color: 'fg.muted', fontSize: 1 }}>Loading your teams...</Text>
          </Box>
        ) : teamList.length === 0 ? (
          <EmptyState
            title="No teams yet"
            description="Create a team to start collaborating with your colleagues."
            icon={PeopleIcon}
            onAction={() => setIsOpen(true)}
          />
        ) : (
          <Box
            sx={{
              display: "grid",
              gap: 3,
              gridTemplateColumns: ["1fr", "repeat(2, 1fr)", "repeat(3, 1fr)"],
            }}
          >
            {teamList.map((ut) => {
              const team = ut.Teams || ut.teams;
              if (!team) {
                console.warn('Registro de membro sem dados do time:', ut);
                return null;
              }

              return (
                <Box
                  key={ut.team_id}
                  onClick={() => setView({ name: 'detail', team: { id: team.id, name: team.name } })}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e: React.KeyboardEvent) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setView({ name: 'detail', team: { id: team.id, name: team.name } });
                    }
                  }}
                  sx={{
                    p: 4,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor: "border.default",
                    bg: "canvas.default",
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                    transition: "all 0.2s ease",
                    cursor: 'pointer',
                    "&:hover": {
                      borderColor: "accent.emphasis",
                      boxShadow: "shadow.medium",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Text sx={{ fontWeight: "bold", fontSize: 2, color: 'fg.default' }}>
                      {team.name}
                    </Text>
                    <Label variant={ut.role === 'admin' ? 'accent' : 'secondary'} sx={{ textTransform: 'capitalize' }}>
                      {ut.role}
                    </Label>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Text sx={{ fontSize: 0, color: "fg.muted" }}>
                      Description: This team is for architecture diagrams!
                    </Text>
                  </Box>

                  <Box sx={{ mt: 'auto', pt: 2, borderTop: '1px solid', borderColor: 'border.subtle' }}>
                    <Text sx={{ fontSize: 0, color: 'fg.subtle' }}>
                      Created at {team.created_at ? new Date(team.created_at).toLocaleDateString() : 'N/A'}
                    </Text>
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>

      {isOpen && (
        <NewTeamDialog
          onClose={() => setIsOpen(false)}
          onSuccess={() => fetchTeams()}
        />
      )}
    </Box>
  );
}
