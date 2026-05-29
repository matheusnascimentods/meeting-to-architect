import { createFileRoute } from "@tanstack/react-router";
import { CounterLabel, Spinner } from "@primer/react";
import { useState, useEffect } from "react";
import { Diagram } from "@/features/diagrams/types";
import { Navbar } from "@/shared/components/Navbar";
import { DiagramCard } from "@/features/diagrams/components/DiagramCard";
import { DiagramDetail } from "@/features/diagrams/components/DiagramDetail";
import { NewDiagramDialog } from "@/features/diagrams/components/NewDiagramDialog";
import { EmptyState } from "@/shared/components/EmptyState";
import { useAuth } from "./__root";
import { api } from "@/shared/lib/api";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

type Screen = { name: "list" } | { name: "detail"; diagramId: string | number };

const fontStack = "system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
const mutedColor = "#6E6E73";

function Dashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [screen, setScreen] = useState<Screen>({ name: "list" });
  const [diagramList, setDiagramList] = useState<Diagram[]>([]);
  const { user, onLogout } = useAuth();

  const fetchDiagrams = async () => {
    setLoading(true);
    try {
      const response = await api.get("/diagrams");
      setDiagramList(response.data);
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
    <div style={{ minHeight: "100vh", background: "#F2F2F7", fontFamily: fontStack }}>
      <Navbar
        showBack={screen.name === "detail"}
        onBack={() => setScreen({ name: "list" })}
        showNewButton={screen.name === "list"}
        onNewClick={() => setIsOpen(true)}
        user={user}
        onLogout={onLogout}
      />

      {screen.name === "list" && (
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <h1 style={{ fontSize: 34, fontWeight: 700, letterSpacing: "-0.02em", margin: 0, fontFamily: fontStack }}>Diagrams</h1>
            {!loading && <CounterLabel>{diagramList.length}</CounterLabel>}
          </div>
          <p style={{ fontSize: 15, color: mutedColor, fontFamily: fontStack, marginBottom: 32 }}>
            All architecture diagrams generated from your meeting transcripts
          </p>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '100px', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <Spinner size="large" />
              <span style={{ color: mutedColor, fontSize: 14 }}>Loading your workspace...</span>
            </div>
          ) : diagramList.length === 0 ? (
            <EmptyState onAction={() => setIsOpen(true)} />
          ) : (
            <div className="m2a-grid">
              {diagramList.map((d) => (
                <DiagramCard key={d.id} diagram={d} onOpen={() => setScreen({ name: "detail", diagramId: d.id })} />
              ))}
            </div>
          )}
        </div>
      )}

      {screen.name === "detail" && activeDiagram && (
        <DiagramDetail diagram={activeDiagram} />
      )}

      {isOpen && (
        <NewDiagramDialog 
          onClose={() => setIsOpen(false)} 
          onSuccess={(newDiagram) => {
            setDiagramList([newDiagram, ...diagramList]);
            setIsOpen(false);
          }}
        />
      )}
    </div>
  );
}
