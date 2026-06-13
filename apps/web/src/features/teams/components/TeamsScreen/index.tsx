import { useState } from "react";
import { Box, Button, CounterLabel, Text } from "@primer/react";
import { PeopleIcon, PlusIcon, MailIcon } from "@primer/octicons-react";
import { NewTeamDialog } from "../NewTeamDialog";
import { EmptyState } from "@/shared/components/EmptyState";
import { TeamDetailScreen } from "@/features/diagrams/components/TeamDetailScreen";
import { useTeams } from "../../hooks/use-teams";
import { LoadingState } from "@/shared/components/LoadingState";
import { ErrorState } from "@/shared/components/ErrorState";
import { tokens } from "@/shared/styles/tokens";
import { COPY } from "@/shared/constants/copy";
import { TeamItem } from "./TeamItem";
import { InvitationsDialog } from "./InvitationsDialog";
import { EditTeamDialog } from "./EditTeamDialog";
import { MembersDialog } from "./MembersDialog";
import { DeleteTeamDialog } from "@/features/teams/components/DeleteTeamDialog";
import { teamService } from "../../services/team.service";
import { Team } from "../../types";
import { useToast } from "@/shared/hooks/use-toast";

type TeamsView =
  | { name: 'list' }
  | { name: 'detail'; team: { id: string; name: string } }

export function TeamsScreen() {
  const { teams, invites, loading, error, refetch, respondInvite } = useTeams();
  const [isOpen, setIsOpen] = useState(false);
  const [isInvitesOpen, setIsInvitesOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [membersTeam, setMembersTeam] = useState<Team | null>(null);
  const [deletingTeam, setDeletingTeam] = useState<Team | null>(null);
  const [view, setView] = useState<TeamsView>({ name: 'list' });
  const { success, error: toastError } = useToast();

  const handleDeleteTeam = async (id: string) => {
    try {
      await teamService.delete(id);
      success("Team deleted successfully.");
      setDeletingTeam(null);
      refetch();
    } catch (err) {
      toastError("Failed to delete team.");
      console.error("Failed to delete team", err);
      throw err;
    }
  };

  if (view.name === 'detail') {
    return (
      <TeamDetailScreen
        team={view.team}
        onBack={() => setView({ name: 'list' })}
      />
    );
  }

  if (loading && teams.length === 0) {
    return <LoadingState message={COPY.teams.loading} />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <Box sx={{ minHeight: "100vh", fontFamily: tokens.layout.fontStack }}>
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

      <Box sx={tokens.container.page}>
        {invites.length > 0 && (
          <Box
            onClick={() => setIsInvitesOpen(true)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 3,
              mb: 4,
              border: '1px solid',
              borderColor: 'accent.emphasis',
              borderRadius: 2,
              bg: 'accent.subtle',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              "&:hover": {
                bg: 'accent.muted',
                transform: 'translateY(-1px)',
                boxShadow: 'shadow.small',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <MailIcon size={20} />
              <Text sx={{ fontWeight: 'bold', fontSize: 2 }}>{COPY.teams.invites}</Text>
              <CounterLabel sx={{ bg: 'accent.emphasis', color: 'fg.onEmphasis' }}>
                {invites.length}
              </CounterLabel>
            </Box>
            <Text sx={{ fontSize: 0, fontWeight: 'bold', color: 'accent.fg' }}>
              View all pending invitations →
            </Text>
          </Box>
        )}

        <Box sx={{ display: "flex", alignItems: "center", gap: 2, marginBottom: 1 }}>
          <Text as="h1" sx={tokens.text.heading}>
            {COPY.teams.title}
          </Text>
          <CounterLabel>{teams.length}</CounterLabel>
        </Box>
        <Text as="p" sx={{ ...tokens.text.muted, marginBottom: 4 }}>
          {COPY.teams.subtitle}
        </Text>

        {teams.length === 0 ? (
          <EmptyState
            title={COPY.teams.empty.title}
            description={COPY.teams.empty.description}
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
            {teams.map((ut) => {
              const team = ut.Teams || ut.teams;
              return (
                <TeamItem
                  key={ut.team_id}
                  userTeam={ut}
                  onClick={() => {
                    if (team) setView({ name: 'detail', team: { id: team.id, name: team.name } });
                  }}
                  onEdit={() => team && setEditingTeam(team)}
                  onMembers={() => team && setMembersTeam(team)}
                  onDelete={() => team && setDeletingTeam(team)}
                />
              );
            })}
          </Box>
        )}
      </Box>

      {isOpen && (
        <NewTeamDialog
          onClose={() => setIsOpen(false)}
          onSuccess={() => {
            success("Team created successfully.");
            refetch();
          }}
        />
      )}

      {isInvitesOpen && (
        <InvitationsDialog
          invites={invites}
          onClose={() => setIsInvitesOpen(false)}
          onRespond={respondInvite}
        />
      )}

      {editingTeam && (
        <EditTeamDialog
          team={editingTeam}
          onClose={() => setEditingTeam(null)}
          onSuccess={refetch}
        />
      )}

      {membersTeam && (
        <MembersDialog
          teamId={membersTeam.id}
          teamName={membersTeam.name}
          onClose={() => setMembersTeam(null)}
        />
      )}

      {deletingTeam && (
        <DeleteTeamDialog
          team={deletingTeam}
          onClose={() => setDeletingTeam(null)}
          onConfirm={() => handleDeleteTeam(deletingTeam.id)}
        />
      )}
    </Box>
  );
}
