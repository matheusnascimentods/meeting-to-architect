import { useState } from "react";
import { Box, Button, CounterLabel, Text } from "@primer/react";
import { PeopleIcon, PlusIcon } from "@primer/octicons-react";
import { NewTeamDialog } from "../NewTeamDialog";
import { EmptyState } from "@/shared/components/EmptyState";
import { TeamDetailScreen } from "@/features/diagrams/components/TeamDetailScreen";
import { useTeams } from "../../hooks/useTeams";
import { LoadingState } from "@/shared/components/LoadingState";
import { ErrorState } from "@/shared/components/ErrorState";
import { tokens } from "@/shared/styles/tokens";
import { COPY } from "@/shared/constants/copy";
import { TeamItem } from "./TeamItem";
import { InviteItem } from "./InviteItem";

type TeamsView =
  | { name: 'list' }
  | { name: 'detail'; team: { id: string; name: string } }

export function TeamsScreen() {
  const { teams, invites, loading, error, refetch, respondInvite } = useTeams();
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<TeamsView>({ name: 'list' });

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
          <Box sx={{ mb: 4 }}>
            <Text as="h2" sx={{ fontSize: 2, fontWeight: 'bold', mb: 2 }}>
              {COPY.teams.invites}
              <CounterLabel sx={{ ml: 2 }}>{invites.length}</CounterLabel>
            </Text>
            {invites.map((invite) => (
              <InviteItem
                key={invite.id}
                invite={invite}
                onRespond={respondInvite}
              />
            ))}
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
            {teams.map((ut) => (
              <TeamItem
                key={ut.team_id}
                userTeam={ut}
                onClick={() => {
                  const team = ut.Teams || ut.teams;
                  if (team) setView({ name: 'detail', team: { id: team.id, name: team.name } });
                }}
              />
            ))}
          </Box>
        )}
      </Box>

      {isOpen && (
        <NewTeamDialog
          onClose={() => setIsOpen(false)}
          onSuccess={refetch}
        />
      )}
    </Box>
  );
}
