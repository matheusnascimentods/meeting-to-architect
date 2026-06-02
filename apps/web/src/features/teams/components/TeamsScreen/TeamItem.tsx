import { Box, Text, Label } from '@primer/react';
import { UserTeam } from '../../types';
import { tokens } from '@/shared/styles/tokens';

interface Props {
  userTeam: UserTeam;
  onClick: () => void;
}

export function TeamItem({ userTeam, onClick }: Props) {
  const team = userTeam.Teams || userTeam.teams;
  if (!team) return null;

  return (
    <Box
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      sx={{
        p: 4,
        borderRadius: 2,
        border: "1px solid",
        borderColor: "border.default",
        bg: "canvas.default",
        display: "flex",
        flexDirection: "column",
        gap: 3,
        transition: "all 0.2s ease",
        cursor: 'pointer',
        "&:hover": {
          borderColor: "accent.emphasis",
          boxShadow: "shadow.medium",
          transform: "translateY(-2px)",
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Text sx={{ fontWeight: "bold", fontSize: 2, color: 'fg.default' }}>
          {team.name}
        </Text>
        <Label variant={userTeam.role === 'admin' ? 'accent' : 'secondary'} sx={{ textTransform: 'capitalize' }}>
          {userTeam.role}
        </Label>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Text sx={{ fontSize: 0, color: "fg.muted" }}>
          Description: This team is for architecture diagrams!
        </Text>
      </Box>

      <Box sx={{ mt: 'auto', pt: 2, borderTop: '1px solid', borderColor: 'border.subtle' }}>
        <Text sx={{ fontSize: 0, color: 'fg.subtle' }}>
          Created at {team.created_at ? new Date(team.created_at).toLocaleDateString() : 'N/A'}
        </Text>
      </Box>
    </Box>
  );
}
