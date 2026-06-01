import { Flash, Box, Text } from "@primer/react";
import { CheckIcon } from "@primer/octicons-react";

export function DeleteSuccessBanner() {
  return (
    <Flash variant="danger" sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
      <CheckIcon />
      <Text>Diagram successfully deleted!</Text>
    </Flash>
  );
}
