import { Dialog, Box, Text, CounterLabel } from '@primer/react';
import { InviteItem } from './InviteItem';
import { TeamInvite } from '../../types';

interface Props {
  invites: TeamInvite[];
  onClose: () => void;
  onRespond: (id: string, accept: boolean) => void;
}

export function InvitationsDialog({ invites, onClose, onRespond }: Props) {
  return (
    <Dialog
      title={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Text sx={{ fontWeight: 'bold' }}>My Invitations</Text>
          <CounterLabel>{invites.length}</CounterLabel>
        </Box>
      }
      onClose={onClose}
      width="small"
    >
      <Box sx={{ p: 3, maxHeight: '60vh', overflowY: 'auto' }}>
        {invites.length === 0 ? (
          <Text sx={{ color: 'fg.muted' }}>No pending invitations.</Text>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {invites.map((invite) => (
              <InviteItem
                key={invite.id}
                invite={invite}
                onRespond={onRespond}
              />
            ))}
          </Box>
        )}
      </Box>
    </Dialog>
  );
}
