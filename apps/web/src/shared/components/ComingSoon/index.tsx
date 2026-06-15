import { Box } from '@primer/react';
import { Blankslate } from '@primer/react/experimental';
import { ComingSoonProps } from './index.types';

export function ComingSoon({ icon: Icon, label }: ComingSoonProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <Blankslate>
        <Blankslate.Visual>
          <Icon size={40} />
        </Blankslate.Visual>
        <Blankslate.Heading>{label}</Blankslate.Heading>
        <Blankslate.Description>This feature will be available soon.</Blankslate.Description>
      </Blankslate>
    </Box>
  );
}
