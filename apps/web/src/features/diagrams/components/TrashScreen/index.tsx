import React, { useState } from 'react';
import { Box, Text, Dialog, CounterLabel } from '@primer/react';
import { TrashIcon } from '@primer/octicons-react';
import { Diagram } from '../../types';
import { EmptyState } from '@/shared/components/EmptyState';
import { useTrash } from '../../hooks/use-trash';
import { LoadingState } from '@/shared/components/LoadingState';
import { ErrorState } from '@/shared/components/ErrorState';
import { tokens } from '@/shared/styles/tokens';
import { COPY } from '@/shared/constants/copy';
import { TrashItem } from './TrashItem';

import { useToast } from '@/shared/hooks/use-toast';

interface Props {
  onNavigate?: (screen: string) => void;
}

export function TrashScreen({ onNavigate }: Props) {
  const { items, loading, error, restore, permanentDelete } = useTrash();
  const { success } = useToast();
  const [diagramToDelete, setDiagramToDelete] = useState<Diagram | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handlePermanentDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      await permanentDelete(id);
      success(COPY.trash.clearSuccess);
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
      success(COPY.trash.restoreSuccess);
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
          title="Delete permanently?"
          onClose={() => setDiagramToDelete(null)}
          footerButtons={[
            {
              buttonType: 'default',
              content: COPY.common.cancel,
              onClick: () => setDiagramToDelete(null),
            },
            {
              buttonType: 'danger',
              content: isDeleting ? 'Deleting...' : 'Delete permanently',
              onClick: () => void handlePermanentDelete(diagramToDelete.id),
              disabled: isDeleting,
            },
          ]}
        >
          <Box sx={{ p: 3 }}>
            <Text>This action cannot be undone. The diagram <strong>{diagramToDelete.title}</strong> will be removed forever.</Text>
          </Box>
        </Dialog>
      )}
    </Box>
  );
}
