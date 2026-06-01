import { useState, useEffect } from "react";
import { Box, Button, CounterLabel, Spinner, Text } from "@primer/react";
import { PeopleIcon, PlusIcon } from "@primer/octicons-react";
import { UserTeam } from "../../types";
import { teamService } from "../../services/team.service";
import { NewTeamDialog } from "../NewTeamDialog";
import { EmptyState } from "@/shared/components/EmptyState";

const fontStack = "system-ui, -apple-system, BlinkMacSystemFont, sans-serif";

export function TeamsScreen() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [teamList, setTeamList] = useState<UserTeam[]>([]);

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const data = await teamService.findAll();
      setTeamList(data);
    } catch (err) {
      console.error("Failed to fetch teams", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", fontFamily: fontStack }}>
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

      <Box sx={{ maxWidth: 1200, margin: "0 auto", padding: "40px 32px" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, marginBottom: 1 }}>
          <Text as="h1" sx={{ fontSize: 5, fontWeight: 'bold', letterSpacing: "-0.02em", margin: 0 }}>
            Teams
          </Text>
          {!loading && <CounterLabel>{teamList.length}</CounterLabel>}
        </Box>
        <Text as="p" sx={{ fontSize: 1, color: 'fg.muted', marginBottom: 4 }}>
          Collaborate with your colleagues on architecture diagrams
        </Text>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', padding: '100px', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <Spinner size="large" />
            <Text sx={{ color: 'fg.muted', fontSize: 1 }}>Loading your teams...</Text>
          </Box>
        ) : teamList.length === 0 ? (
          <EmptyState 
            title="No teams yet"
            description="Create a team to start collaborating with your colleagues."
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
            {teamList.map((ut) => (
              <Box
                key={ut.team_id}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "border.default",
                  bg: "canvas.default",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  "&:hover": {
                    borderColor: "accent.emphasis",
                  },
                }}
              >
                <Text sx={{ fontWeight: "bold", fontSize: 2 }}>{ut.Teams.name}</Text>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Text sx={{ fontSize: 0, color: "fg.muted" }}>Role: {ut.role}</Text>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {isOpen && (
        <NewTeamDialog
          onClose={() => setIsOpen(false)}
          onSuccess={() => fetchTeams()}
        />
      )}
    </Box>
  );
}
