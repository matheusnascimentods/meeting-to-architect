import { Flash, Box, Text } from "@primer/react";
import { CheckIcon } from "@primer/octicons-react";

export function DeleteSuccessBanner() {
  return (
    <Flash variant="success" sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
      <CheckIcon />
      <Text>Diagrama excluído com sucesso!</Text>
    </Flash>
  );
}
