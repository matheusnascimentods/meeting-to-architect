import { Box, Text, Button } from '@primer/react';
import { TeamInvite } from '../../types';

interface Props {
  invite: TeamInvite;
  onRespond: (id: string, accept: boolean) => void;
}

export function InviteItem({ invite, onRespond }: Props) {
  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      p: 3,
      mb: 2,
      border: '1px solid',
      borderColor: 'border.default',
      borderRadius: 2,
      bg: 'canvas.default',
    }}>
      <Box>
        <Text sx={{ fontWeight: 'bold', display: 'block' }}>{invite.Teams?.name}</Text>
        <Text sx={{ color: 'fg.muted', fontSize: 0 }}>Você foi convidado para este time</Text>
      </Box>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button size="small" variant="primary" onClick={() => onRespond(invite.id, true)}>
          Aceitar
        </Button>
        <Button size="small" variant="danger" onClick={() => onRespond(invite.id, false)}>
          Recusar
        </Button>
      </Box>
    </Box>
  );
}
