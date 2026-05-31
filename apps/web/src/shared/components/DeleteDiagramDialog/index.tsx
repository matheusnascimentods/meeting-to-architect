import React from "react";
import { Dialog, Box, Text, Button, Flash } from "@primer/react";
import { RepoIcon, StarIcon, EyeIcon, AlertIcon } from "@primer/octicons-react";
import { Diagram } from "@/features/diagrams/types";

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
    } catch (err: any) {
      console.error("Failed to confirm deletion:", err);
      setError(err.response?.data?.message || "Ocorreu um erro ao excluir o diagrama.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      title={`Delete ${diagram.title}`}
      onClose={onClose}
      width="medium"
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
          <Box sx={{ display: 'flex', gap: 3, color: 'fg.muted', fontSize: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <StarIcon size={12} /> 0 stars
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EyeIcon size={12} /> 0 watchers
            </Box>
          </Box>
        </Box>

        <Text sx={{ display: 'block', mb: 3, fontSize: 1, color: 'fg.muted' }}>
            This action cannot be undone. This will permanently delete the <strong>{diagram.title}</strong> diagram and all of its data.
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
