import { useState } from "react";
import { Box, Button, CounterLabel, IconButton, Text } from "@primer/react";
import { ArrowLeftIcon, PlusIcon } from "@primer/octicons-react";
import { DiagramCard } from "../DiagramCard";
import { DiagramDetail } from "../DiagramDetail";
import { NewDiagramDialog } from "../NewDiagramDialog";
import { EmptyState } from "@/shared/components/EmptyState";
import { useToast } from "@/shared/hooks/use-toast";
import { useDiagrams } from "../../hooks/useDiagrams";
import { LoadingState } from "@/shared/components/LoadingState";
import { ErrorState } from "@/shared/components/ErrorState";
import { COPY } from "@/shared/constants/copy";
import { tokens } from "@/shared/styles/tokens";

type Screen = { name: "list" } | { name: "detail"; diagramId: string };

export function DiagramsScreen() {
  const { diagrams, loading, error, refetch } = useDiagrams();
  const { success } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [screen, setScreen] = useState<Screen>({ name: "list" });

  const activeDiagram = screen.name === "detail" ? diagrams.find((d) => d.id === screen.diagramId) : null;

  const handleDelete = () => {
    refetch();
    if (screen.name === "detail") {
      setScreen({ name: "list" });
    }
    success("Diagram successfully deleted!");
  };

  if (loading && diagrams.length === 0) {
    return <LoadingState message={COPY.diagrams.loading} />;
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
            {COPY.diagrams.empty.action}
          </Button>
        )}
      </Box>

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
                  onOpen={() => setScreen({ name: "detail", diagramId: d.id })}
                  onUpdate={refetch}
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
            refetch();
            setIsOpen(false);
            setScreen({ name: "detail", diagramId: newDiagram.id });
          }}
        />
      )}
    </Box>
  );
}
