import React, { useState } from 'react';
import { Box, Text, Dialog, CounterLabel, Flash } from '@primer/react';
import { TrashIcon } from '@primer/octicons-react';
import { Diagram } from '../../types';
import { EmptyState } from '@/shared/components/EmptyState';
import { useTrash } from '../../hooks/useTrash';
import { LoadingState } from '@/shared/components/LoadingState';
import { ErrorState } from '@/shared/components/ErrorState';
import { tokens } from '@/shared/styles/tokens';
import { COPY } from '@/shared/constants/copy';
import { TrashItem } from './TrashItem';

interface Props {
  onNavigate?: (screen: string) => void;
}

export function TrashScreen({ onNavigate }: Props) {
  const { items, loading, error, restore, permanentDelete } = useTrash();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [diagramToDelete, setDiagramToDelete] = useState<Diagram | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handlePermanentDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      await permanentDelete(id);
      setSuccessMessage(COPY.trash.clearSuccess);
      setTimeout(() => setSuccessMessage(null), 5000);
      setDiagramToDelete(null);
    } catch (err) {
      // Error handled by hook
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRestore = async (id: string) => {
    try {
      await restore(id);
      setSuccessMessage(COPY.trash.restoreSuccess);
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err) {
      // Error handled by hook
    }
  };

  if (loading && items.length === 0) {
    return <LoadingState message={COPY.trash.loading} />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <Box sx={{ minHeight: '100vh', fontFamily: tokens.layout.fontStack }}>
      <Box sx={tokens.container.page}>
        {successMessage && (
          <Flash variant="success" sx={{ mb: 3 }}>
            {successMessage}
          </Flash>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 1 }}>
          <Text as="h1" sx={tokens.text.heading}>
            {COPY.trash.title}
          </Text>
          {items.length > 0 && (
            <CounterLabel>{items.length}</CounterLabel>
          )}
        </Box>
        <Text as="p" sx={{ ...tokens.text.muted, marginBottom: 4 }}>
          {COPY.trash.subtitle}
        </Text>

        {items.length === 0 ? (
          <EmptyState
            icon={TrashIcon}
            title={COPY.trash.empty.title}
            description={COPY.trash.empty.description}
            onAction={() => onNavigate?.('diagrams')}
          />
        ) : (
          <Box>
            {items.map((diagram) => (
              <TrashItem
                key={diagram.id}
                diagram={diagram}
                onRestore={handleRestore}
                onDelete={setDiagramToDelete}
              />
            ))}
          </Box>
        )}
      </Box>

      {diagramToDelete && (
        <Dialog
          title="Excluir permanentemente?"
          onClose={() => setDiagramToDelete(null)}
          footerButtons={[
            {
              buttonType: 'default',
              content: COPY.common.cancel,
              onClick: () => setDiagramToDelete(null),
            },
            {
              buttonType: 'danger',
              content: isDeleting ? 'Excluindo...' : 'Excluir permanentemente',
              onClick: () => void handlePermanentDelete(diagramToDelete.id),
              disabled: isDeleting,
            },
          ]}
        >
          <Box sx={{ p: 3 }}>
            <Text>Esta ação não pode ser desfeita. O diagrama <strong>{diagramToDelete.title}</strong> será removido para sempre.</Text>
          </Box>
        </Dialog>
      )}
    </Box>
  );
}
