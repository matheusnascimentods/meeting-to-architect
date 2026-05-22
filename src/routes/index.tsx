import { createFileRoute } from "@tanstack/react-router";
import { ThemeProvider, BaseStyles, CounterLabel } from "@primer/react";
import { useState } from "react";
import { Diagram } from "../types";
import { Navbar } from "../components/Navbar";
import { DiagramCard } from "../components/DiagramCard";
import { DiagramDetail } from "../components/DiagramDetail";
import { NewDiagramDialog } from "../components/NewDiagramDialog";
import { EmptyState } from "../components/EmptyState";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

const diagrams: Diagram[] = [
  { id: "auth-flow", title: "User Authentication Flow", type: "Sequence", description: "Diagrama gerado a partir da reunião de kickoff do módulo de auth.", date: "2 days ago", variant: "accent", author: "Matheus Santos" },
  { id: "microservices", title: "Microservices Overview", type: "Flowchart", description: "Visão geral da arquitetura de microsserviços discutida na sprint review.", date: "5 days ago", variant: "success", author: "Matheus Santos" },
  { id: "db-schema", title: "Database Schema v2", type: "Entity", description: "Modelo de entidades atualizado após reunião com o time de dados.", date: "1 week ago", variant: "attention", author: "Matheus Santos" },
  { id: "deploy", title: "Deployment Pipeline", type: "Flowchart", description: "Pipeline de CI/CD definido na reunião de DevOps.", date: "1 week ago", variant: "danger", author: "Matheus Santos" },
  { id: "order-domain", title: "Order Domain Model", type: "Class", description: "Modelagem do domínio de pedidos discutida com o arquiteto sênior.", date: "2 weeks ago", variant: "accent", author: "Matheus Santos" },
  { id: "incident", title: "Incident Post-Mortem", type: "Sequence", description: "Sequência de eventos do incidente de produção de 12/03.", date: "3 weeks ago", variant: "success", author: "Matheus Santos" },
];

type Screen = { name: "list" } | { name: "detail"; diagramId: string };

const fontStack = "system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
const mutedColor = "#6E6E73";

function Dashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [screen, setScreen] = useState<Screen>({ name: "list" });

  const activeDiagram = screen.name === "detail" ? diagrams.find((d) => d.id === screen.diagramId) : null;

  return (
    <ThemeProvider colorMode="auto">
      <BaseStyles>
        <div style={{ minHeight: "100vh", background: "#F2F2F7", fontFamily: fontStack }}>
          <Navbar
            showBack={screen.name === "detail"}
            onBack={() => setScreen({ name: "list" })}
            showNewButton={screen.name === "list"}
            onNewClick={() => setIsOpen(true)}
          />

          {screen.name === "list" && (
            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 32px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <h1 style={{ fontSize: 34, fontWeight: 700, letterSpacing: "-0.02em", margin: 0, fontFamily: fontStack }}>Diagrams</h1>
                <CounterLabel>{diagrams.length}</CounterLabel>
              </div>
              <p style={{ fontSize: 15, color: mutedColor, fontFamily: fontStack, marginBottom: 32 }}>
                All architecture diagrams generated from your meeting transcripts
              </p>

              {diagrams.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="m2a-grid">
                  {diagrams.map((d) => (
                    <DiagramCard key={d.id} diagram={d} onOpen={() => setScreen({ name: "detail", diagramId: d.id })} />
                  ))}
                </div>
              )}
            </div>
          )}

          {screen.name === "detail" && activeDiagram && (
            <DiagramDetail diagram={activeDiagram} />
          )}

          {isOpen && <NewDiagramDialog onClose={() => setIsOpen(false)} />}
        </div>
      </BaseStyles>
    </ThemeProvider>
  );
}
