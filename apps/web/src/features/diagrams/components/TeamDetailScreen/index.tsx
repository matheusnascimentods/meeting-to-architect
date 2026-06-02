import { useState } from "react";
import { Box, CounterLabel, IconButton, Text } from "@primer/react";
import { ArrowLeftIcon } from "@primer/octicons-react";
import { Diagram } from "../../types";
import { DiagramCard } from "../DiagramCard";
import { DiagramDetail } from "../DiagramDetail";
import { EmptyState } from "@/shared/components/EmptyState";
import { useTeamDetail } from "../../hooks/useTeamDetail";
import { LoadingState } from "@/shared/components/LoadingState";
import { ErrorState } from "@/shared/components/ErrorState";
import { tokens } from "@/shared/styles/tokens";
import { InviteMember } from "./InviteMember";
import { TeamRequests } from "./TeamRequests";

interface Props {
  team: { id: string; name: string };
  onBack: () => void;
}

export function TeamDetailScreen({ team, onBack }: Props) {
  const { role, diagrams, requests, loading, error, refetch, inviteMember, respondRequest } = useTeamDetail(team.id);
  const [selectedDiagram, setSelectedDiagram] = useState<Diagram | null>(null);
  const isAdmin = role === 'admin';

  if (selectedDiagram) {
    return (
      <Box sx={{ minHeight: "100vh", fontFamily: tokens.layout.fontStack }}>
        <Box
          as="nav"
          sx={{
            display: "flex",
            alignItems: "center",
            padding: "16px 32px",
            background: "canvas.default",
            borderBottom: "1px solid",
            borderColor: "border.default",
          }}
        >
          <IconButton
            icon={ArrowLeftIcon}
            aria-label="Back to diagrams"
            variant="invisible"
            onClick={() => setSelectedDiagram(null)}
          />
        </Box>
        <DiagramDetail
          diagram={selectedDiagram}
          onDelete={() => {
            refetch();
            setSelectedDiagram(null);
          }}
        />
      </Box>
    );
  }

  if (loading && diagrams.length === 0) {
    return <LoadingState message="Loading team diagrams..." />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <Box sx={{ minHeight: "100vh", fontFamily: tokens.layout.fontStack }}>
      <Box sx={tokens.container.page}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <IconButton
            icon={ArrowLeftIcon}
            aria-label="Voltar para times"
            variant="invisible"
            onClick={onBack}
          />
          <Text as="h1" sx={tokens.text.heading}>
            {team.name}
          </Text>
          <CounterLabel>{diagrams.length}</CounterLabel>
        </Box>
        <Text as="p" sx={{ ...tokens.text.muted, marginBottom: 4 }}>
          This team is for architecture diagrams.
        </Text>

        {isAdmin && (
          <InviteMember onInvite={inviteMember} />
        )}

        {isAdmin && (
          <TeamRequests requests={requests} onRespond={respondRequest} />
        )}

        {diagrams.length === 0 ? (
          <EmptyState
            title="This team does not have any formation"
            description="Formations approved by the admin will appear here."
          />
        ) : (
          <Box
            sx={{
              display: "grid",
              gap: 3,
              gridTemplateColumns: ["1fr", "repeat(2, 1fr)", "repeat(3, 1fr)"],
            }}
          >
            {diagrams.map((d) => (
              <DiagramCard
                key={d.id}
                diagram={d}
                onOpen={() => setSelectedDiagram(d)}
                onUpdate={refetch}
                onDelete={refetch}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}
