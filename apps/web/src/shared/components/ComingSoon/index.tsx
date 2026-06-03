import { Box } from '@primer/react';
import { Blankslate } from '@primer/react/experimental';

interface Props {
  icon: React.ElementType;
  label: string;
}

export function ComingSoon({ icon: Icon, label }: Props) {
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
