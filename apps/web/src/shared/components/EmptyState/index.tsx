import React from 'react';
import { Box, Text } from '@primer/react';
import { EmptyStateProps } from './index.types';

export const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  onAction 
}: EmptyStateProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 8,
        px: 4,
        textAlign: 'center',
        bg: 'canvas.default',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'border.default',
      }}
    >
      {Icon && <Icon size={64} fill="var(--color-fg-muted)" />}
      <Text sx={{ fontSize: 3, fontWeight: 'bold', mt: 3, mb: 2 }}>{title}</Text>
      <Text sx={{ color: 'fg.muted', mb: 4, maxWidth: '400px' }}>{description}</Text>
      {onAction && <button onClick={onAction}>Action</button>}
    </Box>
  );
};
