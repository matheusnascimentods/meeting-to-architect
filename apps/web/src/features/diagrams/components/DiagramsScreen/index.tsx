import { useState } from "react";
import { Box, Button, CounterLabel, IconButton, Text } from "@primer/react";
import { ArrowLeftIcon, PlusIcon } from "@primer/octicons-react";
import { DiagramCard } from "../DiagramCard";
import { PendingRequests } from "../PendingRequests";
import { RequestsDrawer } from "../RequestsDrawer";
import { DiagramDetail } from "../DiagramDetail";
import { NewDiagramDialog } from "../NewDiagramDialog";
import { EmptyState } from "@/shared/components/EmptyState";
import { useToast } from "@/shared/hooks/use-toast";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { Navbar } from "@/shared/components/Navbar";
import { useDiagrams } from "../../hooks/use-diagrams";
import { useTeams } from "@/features/teams/hooks/use-teams";
import { LoadingState } from "@/shared/components/LoadingState";
import { ErrorState } from "@/shared/components/ErrorState";
import { COPY } from "@/shared/constants";
import { tokens } from "@/shared/constants";
import { Screen } from "./index.types";

export function DiagramsScreen() {
  const { diagrams, loading: loadingDiagrams, error: errorDiagrams, refetch: refetchDiagrams } = useDiagrams();
  const { teams: userTeams, loading: loadingTeams } = useTeams();
  const { success } = useToast();
  const { user, onLogout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showRequests, setShowRequests] = useState(false);
  const [screen, setScreen] = useState<Screen>({ name: "list" });
  const [refreshKey, setRefreshKey] = useState(0);

  const diagramsLoading = loadingDiagrams && diagrams.length === 0;

  const activeDiagram = screen.name === "detail" ? diagrams.find((d) => d.id === screen.diagramId) : null;

  const handleDelete = () => {
    refetchDiagrams();
    if (screen.name === "detail") {
      setScreen({ name: "list" });
    }
    success("Diagram successfully deleted!");
  };

  const handleCancelRequest = () => {
    setRefreshKey((prev) => prev + 1);
  };

  if (diagramsLoading) {
    return <LoadingState message={COPY.diagrams.loading} />;
  }

  if (errorDiagrams) {
    return <ErrorState message={errorDiagrams} />;
  }

  return (
    <Box sx={{ minHeight: "100vh", fontFamily: tokens.layout.fontStack }}>
      <Navbar
        user={user}
        onLogout={onLogout}
        showBack={screen.name === "detail"}
        onBack={() => setScreen({ name: "list" })}
        showNewButton={screen.name === "list"}
        onNewClick={() => setIsOpen(true)}
      />

      {showRequests && <RequestsDrawer onClose={() => setShowRequests(false)} />}

      {screen.name === "list" && (
        <Box sx={tokens.container.page}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, marginBottom: 1 }}>
            <Text as="h1" sx={tokens.text.heading}>
              {COPY.diagrams.title}
            </Text>
            <CounterLabel>{diagrams.length}</CounterLabel>
          </Box>
          <Text as="p" sx={{ ...tokens.text.muted, marginBottom: 4 }}>
            {COPY.diagrams.subtitle}
          </Text>

          <PendingRequests onClick={() => setShowRequests(true)} />

          {diagrams.length === 0 ? (
            <EmptyState onAction={() => setIsOpen(true)} />
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
                  userTeams={userTeams}
                  refreshKey={refreshKey}
                  onOpen={() => setScreen({ name: "detail", diagramId: d.id })}
                  onUpdate={refetchDiagrams}
                  onDelete={handleDelete}
                />
              ))}
            </Box>
          )}
        </Box>
      )}

      {screen.name === "detail" && activeDiagram && (
        <DiagramDetail
          diagram={activeDiagram}
          onDelete={handleDelete}
        />
      )}

      {isOpen && (
        <NewDiagramDialog 
          onClose={() => setIsOpen(false)} 
          onSuccess={(newDiagram) => {
            success("Diagram created successfully.");
            refetchDiagrams();
            setIsOpen(false);
            setScreen({ name: "detail", diagramId: newDiagram.id });
          }}
        />
      )}
    </Box>
  );
}
