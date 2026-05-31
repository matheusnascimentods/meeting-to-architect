import { useState, useEffect } from "react";
import { Box, Button, CounterLabel, IconButton, Spinner, Text } from "@primer/react";
import { ArrowLeftIcon, PlusIcon } from "@primer/octicons-react";
import { Diagram } from "../../types";
import { diagramService } from "../../services/diagram.service";
import { DiagramCard } from "../DiagramCard";
import { DiagramDetail } from "../DiagramDetail";
import { NewDiagramDialog } from "../NewDiagramDialog";
import { EmptyState } from "@/shared/components/EmptyState";
import { DeleteSuccessBanner } from "@/shared/components/DeleteSuccessBanner";

type Screen = { name: "list" } | { name: "detail"; diagramId: string };

const fontStack = "system-ui, -apple-system, BlinkMacSystemFont, sans-serif";

export function DiagramsScreen() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [screen, setScreen] = useState<Screen>({ name: "list" });
  const [diagramList, setDiagramList] = useState<Diagram[]>([]);

  const fetchDiagrams = async () => {
    setLoading(true);
    try {
      const data = await diagramService.findAll();
      setDiagramList(data);
    } catch (err) {
      console.error("Failed to fetch diagrams", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiagrams();
  }, []);

  const activeDiagram = screen.name === "detail" ? diagramList.find((d) => d.id === screen.diagramId) : null;

  return (
    <Box sx={{ minHeight: "100vh", fontFamily: fontStack }}>
      <Box
        as="nav"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: screen.name === "detail" ? "space-between" : "flex-end",
          padding: "16px 32px",
          background: "canvas.default",
          borderBottom: "1px solid",
          borderColor: "border.default",
        }}
      >
        {screen.name === "detail" && (
          <IconButton
            icon={ArrowLeftIcon}
            aria-label="Back to list"
            variant="invisible"
            onClick={() => setScreen({ name: "list" })}
          />
        )}
        {screen.name === "list" && (
          <Button variant="primary" leadingVisual={PlusIcon} onClick={() => setIsOpen(true)}>
            New Diagram
          </Button>
        )}
      </Box>

      {screen.name === "list" && (
        <Box sx={{ maxWidth: 1200, margin: "0 auto", padding: "40px 32px" }}>
          {showSuccess && <DeleteSuccessBanner />}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, marginBottom: 1 }}>
            <Text as="h1" sx={{ fontSize: 5, fontWeight: 'bold', letterSpacing: "-0.02em", margin: 0 }}>
              Diagrams
            </Text>
            {!loading && <CounterLabel>{diagramList.length}</CounterLabel>}
          </Box>
          <Text as="p" sx={{ fontSize: 1, color: 'fg.muted', marginBottom: 4 }}>
            All architecture diagrams generated from your meeting transcripts
          </Text>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', padding: '100px', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
              <Spinner size="large" />
              <Text sx={{ color: 'fg.muted', fontSize: 1 }}>Loading your workspace...</Text>
            </Box>
          ) : diagramList.length === 0 ? (
            <EmptyState onAction={() => setIsOpen(true)} />
          ) : (
            <Box
              sx={{
                display: "grid",
                gap: 3,
                gridTemplateColumns: ["1fr", "repeat(2, 1fr)", "repeat(3, 1fr)"],
              }}
            >
              {diagramList.map((d) => (
                <DiagramCard
                  key={d.id}
                  diagram={d}
                  onOpen={() => setScreen({ name: "detail", diagramId: d.id })}
                  onUpdate={(updated) => {
                    setDiagramList(diagramList.map((item) => (item.id === updated.id ? updated : item)));
                  }}
                  onDelete={(id) => {
                    setDiagramList(diagramList.filter((item) => item.id !== id));
                    setShowSuccess(true);
                    setTimeout(() => setShowSuccess(false), 3000);
                  }}
                />
              ))}
            </Box>
          )}
        </Box>
      )}

      {screen.name === "detail" && activeDiagram && (
        <DiagramDetail
          diagram={activeDiagram}
          onDelete={() => {
            setDiagramList(diagramList.filter((d) => d.id !== activeDiagram.id));
            setScreen({ name: "list" });
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
          }}
        />
      )}

      {isOpen && (
        <NewDiagramDialog 
          onClose={() => setIsOpen(false)} 
          onSuccess={(newDiagram) => {
            setDiagramList([newDiagram, ...diagramList]);
            setIsOpen(false);
            setScreen({ name: "detail", diagramId: newDiagram.id });
          }}
        />
      )}
    </Box>
  );
}
