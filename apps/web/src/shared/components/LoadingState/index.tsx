import { Box, Spinner, Text } from '@primer/react';
import { LoadingStateProps } from './index.types';

export function LoadingState({ message = 'Carregando...' }: LoadingStateProps) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', padding: '100px', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
      <Spinner size="large" />
      <Text sx={{ color: 'fg.muted', fontSize: 1 }}>{message}</Text>
    </Box>
  );
}
