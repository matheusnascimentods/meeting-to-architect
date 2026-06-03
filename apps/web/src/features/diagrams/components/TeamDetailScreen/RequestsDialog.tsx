import { Dialog, Box, Text, CounterLabel, Button } from '@primer/react';
import { DiagramRequest } from '../../types';

interface Props {
  requests: DiagramRequest[];
  onClose: () => void;
  onRespond: (id: string, approve: boolean) => void;
}

export function RequestsDialog({ requests, onClose, onRespond }: Props) {
  return (
    <Dialog
      title={
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Text sx={{ fontWeight: 'bold' }}>Pending Requests</Text>
          <CounterLabel>{requests.length}</CounterLabel>
        </Box>
      }
      onClose={onClose}
      width="large"
    >
      <Box sx={{ p: 3, maxHeight: '60vh', overflowY: 'auto' }}>
        {requests.length === 0 ? (
          <Text sx={{ color: 'fg.muted' }}>No pending requests.</Text>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {requests.map((req) => (
              <Box
                key={req.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 3,
                  border: '1px solid',
                  borderColor: 'border.default',
                  borderRadius: 2,
                  bg: 'canvas.default',
                }}
              >
                <Box>
                  <Text sx={{ fontWeight: 'bold', display: 'block' }}>{req.Diagrams?.title}</Text>
                  <Text sx={{ color: 'fg.muted', fontSize: 0 }}>
                    Requested by {req.Users?.name || req.Users?.email} · {req.Diagrams?.type}
                  </Text>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button size="small" variant="primary" onClick={() => onRespond(req.id, true)}>
                    Approve
                  </Button>
                  <Button size="small" variant="danger" onClick={() => onRespond(req.id, false)}>
                    Reject
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Dialog>
  );
}
