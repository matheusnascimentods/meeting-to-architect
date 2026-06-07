import { useState } from "react";
import { Box, CounterLabel, IconButton, Text } from "@primer/react";
import { ArrowLeftIcon, LawIcon } from "@primer/octicons-react";
import { Diagram } from "../../types";
import { DiagramCard } from "../DiagramCard";
import { DiagramDetail } from "../DiagramDetail";
import { EmptyState } from "@/shared/components/EmptyState";
import { useTeamDetail } from "../../hooks/useTeamDetail";
import { LoadingState } from "@/shared/components/LoadingState";
import { ErrorState } from "@/shared/components/ErrorState";
import { tokens } from "@/shared/styles/tokens";
import { InviteMember } from "./InviteMember";
import { RequestsDialog } from "./RequestsDialog";

interface Props {
  team: { id: string; name: string };
  onBack: () => void;
}

export function TeamDetailScreen({ team: teamSummary, onBack }: Props) {
  const { team, role, diagrams, requests, loading, error, refetch, inviteMember, respondRequest } = useTeamDetail(teamSummary.id);
  const [selectedDiagram, setSelectedDiagram] = useState<Diagram | null>(null);
  const [isRequestsOpen, setIsRequestsOpen] = useState(false);
  const isAdmin = role === 'admin';
  const canManageRequests = role === 'admin' || role === 'maintainer';

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
            aria-label="Back to teams"
            variant="invisible"
            onClick={onBack}
          />
          <Text as="h1" sx={tokens.text.heading}>
            {team?.name || teamSummary.name}
          </Text>
          <CounterLabel>{diagrams.length}</CounterLabel>
        </Box>
        <Text as="p" sx={{ ...tokens.text.muted, marginBottom: 4 }}>
          {team?.description || "This team is for architecture diagrams."}
        </Text>

        {isAdmin && (
          <InviteMember onInvite={inviteMember} />
        )}

        {canManageRequests && requests.length > 0 && (
          <Box
            onClick={() => setIsRequestsOpen(true)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 3,
              mb: 4,
              border: '1px solid',
              borderColor: 'attention.emphasis',
              borderRadius: 2,
              bg: 'attention.subtle',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              "&:hover": {
                bg: 'attention.muted',
                transform: 'translateY(-1px)',
                boxShadow: 'shadow.small',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <LawIcon size={20} />
              <Text sx={{ fontWeight: 'bold', fontSize: 2 }}>Pending Requests</Text>
              <CounterLabel sx={{ bg: 'attention.emphasis', color: 'fg.onEmphasis' }}>
                {requests.length}
              </CounterLabel>
            </Box>
            <Text sx={{ fontSize: 0, fontWeight: 'bold', color: 'attention.fg' }}>
              Review pending diagram additions →
            </Text>
          </Box>
        )}

        {diagrams.length === 0 ? (
          <EmptyState
            title="This team does not have any diagrams yet"
            description="Diagrams approved by the admin will appear here."
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

      {isRequestsOpen && (
        <RequestsDialog
          requests={requests}
          onClose={() => setIsRequestsOpen(false)}
          onRespond={respondRequest}
        />
      )}
    </Box>
  );
}
