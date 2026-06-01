import { useState, useEffect } from "react";
import { Box, CounterLabel, IconButton, Spinner, Text, TextInput, Button } from "@primer/react";
import { ArrowLeftIcon } from "@primer/octicons-react";
import { Diagram } from "../../types";
import { diagramService } from "../../services/diagram.service";
import { teamService } from "@/features/teams/services/team.service";
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
  const [isAdmin, setIsAdmin] = useState(false);
  const [requests, setRequests] = useState<any[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [diagramsData, teamInfo] = await Promise.all([
        diagramService.findByTeam(team.id),
        teamService.findById(team.id)
      ]);
      setDiagrams(diagramsData);
      setIsAdmin(teamInfo.role === 'admin');

      if (teamInfo.role === 'admin') {
        const requestsData = await diagramService.getTeamRequests(team.id);
        setRequests(requestsData);
      }
    } catch (err) {
      console.error("Failed to fetch team data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [team.id]);

  const handleInvite = async () => {
    if (!inviteEmail) return;
    try {
      await teamService.invite(team.id, inviteEmail);
      setInviteEmail("");
      alert("Convite enviado com sucesso!");
    } catch (err) {
      console.error("Failed to invite member", err);
      alert("Falha ao enviar convite.");
    }
  };

  const handleRespondRequest = async (requestId: string, approve: boolean) => {
    try {
      await diagramService.respondRequest(requestId, approve);
      fetchData();
    } catch (err) {
      console.error("Failed to respond to request", err);
    }
  };

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

        {isAdmin && (
          <Box sx={{ mb: 4, p: 3, border: '1px solid', borderColor: 'border.default', borderRadius: 2, bg: 'canvas.subtle' }}>
            <Text sx={{ fontWeight: 'bold', fontSize: 1, display: 'block', mb: 2 }}>
              Convidar membro
            </Text>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextInput
                placeholder="email@exemplo.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                sx={{ flex: 1 }}
              />
              <Button variant="primary" onClick={handleInvite}>
                Convidar
              </Button>
            </Box>
          </Box>
        )}

        {isAdmin && requests.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Text as="h2" sx={{ fontSize: 2, fontWeight: 'bold', mb: 2 }}>
              Solicitações pendentes
              <CounterLabel sx={{ ml: 2 }}>{requests.length}</CounterLabel>
            </Text>
            {requests.map((req) => (
              <Box key={req.id} sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 3,
                mb: 2,
                border: '1px solid',
                borderColor: 'attention.muted',
                borderRadius: 2,
                bg: 'attention.subtle',
              }}>
                <Box>
                  <Text sx={{ fontWeight: 'bold', display: 'block' }}>{req.Diagrams?.title}</Text>
                  <Text sx={{ color: 'fg.muted', fontSize: 0 }}>
                    Solicitado por {req.Users?.name || req.Users?.email} · {req.Diagrams?.type}
                  </Text>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button size="small" variant="primary" onClick={() => handleRespondRequest(req.id, true)}>
                    Aprovar
                  </Button>
                  <Button size="small" variant="danger" onClick={() => handleRespondRequest(req.id, false)}>
                    Rejeitar
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>
        )}

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
