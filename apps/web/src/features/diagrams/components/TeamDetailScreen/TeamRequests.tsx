import { Box, Text, Button, CounterLabel } from '@primer/react';
import { COPY } from '@/shared/constants/copy';
import { DiagramRequest } from '../../types';

interface Props {
  requests: DiagramRequest[];
  onRespond: (id: string, approve: boolean) => void;
}

export function TeamRequests({ requests, onRespond }: Props) {
  if (requests.length === 0) return null;

  return (
    <Box sx={{ mb: 4 }}>
      <Text as="h2" sx={{ fontSize: 2, fontWeight: 'bold', mb: 2 }}>
        {COPY.teams.requests}
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
            <Button size="small" variant="primary" onClick={() => onRespond(req.id, true)}>
              Aprovar
            </Button>
            <Button size="small" variant="danger" onClick={() => onRespond(req.id, false)}>
              Rejeitar
            </Button>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
