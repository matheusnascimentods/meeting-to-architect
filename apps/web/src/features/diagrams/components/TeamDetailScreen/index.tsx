import { useState, useEffect } from "react";
import { Box, CounterLabel, IconButton, Spinner, Text } from "@primer/react";
import { ArrowLeftIcon } from "@primer/octicons-react";
import { Diagram } from "../../types";
import { diagramService } from "../../services/diagram.service";
import { DiagramCard } from "../DiagramCard";
import { DiagramDetail } from "../DiagramDetail";
import { EmptyState } from "@/shared/components/EmptyState";

interface Props {
  team: { id: string; name: string };
  onBack: () => void;
}

const fontStack = "system-ui, -apple-system, BlinkMacSystemFont, sans-serif";

export function TeamDetailScreen({ team, onBack }: Props) {
  const [loading, setLoading] = useState(true);
  const [diagrams, setDiagrams] = useState<Diagram[]>([]);
  const [selectedDiagram, setSelectedDiagram] = useState<Diagram | null>(null);

  const fetchTeamDiagrams = async () => {
    setLoading(true);
    try {
      const data = await diagramService.findByTeam(team.id);
      setDiagrams(data);
    } catch (err) {
      console.error("Failed to fetch team diagrams", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamDiagrams();
  }, [team.id]);

  if (selectedDiagram) {
    return (
      <Box sx={{ minHeight: "100vh", fontFamily: fontStack }}>
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
            setDiagrams(diagrams.filter((d) => d.id !== selectedDiagram.id));
            setSelectedDiagram(null);
          }}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", fontFamily: fontStack }}>
      <Box sx={{ maxWidth: 1200, margin: "0 auto", padding: "40px 32px" }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <IconButton
            icon={ArrowLeftIcon}
            aria-label="Voltar para times"
            variant="invisible"
            onClick={onBack}
          />
          <Text as="h1" sx={{ fontSize: 5, fontWeight: 'bold', letterSpacing: '-0.02em', margin: 0 }}>
            {team.name}
          </Text>
          {!loading && <CounterLabel>{diagrams.length}</CounterLabel>}
        </Box>
        <Text as="p" sx={{ fontSize: 1, color: 'fg.muted', marginBottom: 4 }}>
          This team is for architecture diagrams.
        </Text>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', padding: '100px', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <Spinner size="large" />
            <Text sx={{ color: 'fg.muted', fontSize: 1 }}>Loading team diagrams...</Text>
          </Box>
        ) : diagrams.length === 0 ? (
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
                onUpdate={(updated) => {
                  setDiagrams(diagrams.map((item) => (item.id === updated.id ? updated : item)));
                }}
                onDelete={(id) => {
                  setDiagrams(diagrams.filter((item) => item.id !== id));
                }}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}
