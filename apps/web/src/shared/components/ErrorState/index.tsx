import { Flash, Box } from '@primer/react';
import { AlertIcon } from '@primer/octicons-react';
import { ErrorStateProps } from './index.types';

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <Box sx={{ p: 3 }}>
      <Flash variant="danger" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <AlertIcon />
        {message}
      </Flash>
    </Box>
  );
}
