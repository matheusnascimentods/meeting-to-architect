import { useState } from 'react';
import { Box, Text, TextInput, Button } from '@primer/react';
import { InviteMemberProps } from './index.types';

export function InviteMember({ onInvite }: InviteMemberProps) {
  const [inviteEmail, setInviteEmail] = useState("");

  const handleInvite = () => {
    if (!inviteEmail) return;
    onInvite(inviteEmail);
    setInviteEmail("");
  };

  return (
    <Box sx={{ mb: 4, p: 3, border: '1px solid', borderColor: 'border.default', borderRadius: 2, bg: 'canvas.subtle' }}>
      <Text sx={{ fontWeight: 'bold', fontSize: 1, display: 'block', mb: 2 }}>
        Invite member
      </Text>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextInput
          placeholder="email@example.com"
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
          sx={{ flex: 1 }}
        />
        <Button variant="primary" onClick={handleInvite}>
          Invite
        </Button>
      </Box>
    </Box>
  );
}
