import React from "react";
import { Dialog, Box, Text, Button, Flash } from "@primer/react";
import { RepoIcon, AlertIcon } from "@primer/octicons-react";
import { Diagram } from "@/features/diagrams/types";
import { COPY } from "@/shared/constants/copy";

interface DeleteDiagramDialogProps {
  diagram: Diagram;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function DeleteDiagramDialog({ diagram, onClose, onConfirm }: DeleteDiagramDialogProps) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);
    try {
      await onConfirm();
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response: { data: { message: string } } };
        setError(axiosErr.response?.data?.message || COPY.common.error);
      } else {
        setError(COPY.common.error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      title='Do you really want to delete this diagram?'
      onClose={onClose}
      width="large"
    >
      <Box sx={{ p: 3, textAlign: 'center' }}>
        {error && (
          <Flash variant="danger" sx={{ mb: 3, textAlign: 'left' }}>
            <AlertIcon /> {error}
          </Flash>
        )}
        <Box
          sx={{
            border: '1px solid',
            borderColor: 'border.default',
            borderRadius: 2,
            p: 3,
            mb: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            bg: 'canvas.subtle'
          }}
        >
          <Box sx={{ color: 'fg.muted', mb: 2 }}>
            <RepoIcon size={24} />
          </Box>
          <Text sx={{ fontWeight: 'bold', fontSize: 3, mb: 1, display: 'block' }}>
            {diagram.title}
          </Text>
        </Box>

        <Text sx={{ display: 'block', mb: 3, fontSize: 1, color: 'fg.muted' }}>
          This action can be undone. This will move the <strong>{diagram.title}</strong> diagram and all of its data to trash.
        </Text>

        <Button
          variant="danger"
          block
          onClick={handleConfirm}
          disabled={loading}
          sx={{ py: 2 }}
        >
          {loading ? "Deleting..." : "I want to delete this diagram"}
        </Button>
      </Box>
    </Dialog>
  );
}
