import React, { useEffect, useState } from 'react';
import { Box, Text, Button, Spinner, Flash, Dialog, CounterLabel, Label } from '@primer/react';
import { TrashIcon, AlertIcon, FileCodeIcon, ReplyIcon } from '@primer/octicons-react';
import { diagramService } from '../../services/diagram.service';
import { Diagram } from '../../types';
import { EmptyState } from '@/shared/components/EmptyState';

export function TrashScreen({ onNavigate }: { onNavigate?: (screen: string) => void }) {
  const [diagrams, setDiagrams] = useState<Diagram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [diagramToDelete, setDiagramToDelete] = useState<Diagram | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchTrash = async () => {
    try {
      setLoading(true);
      const data = await diagramService.getTrash();
      setDiagrams(data);
    } catch (err: any) {
      setError('Erro ao carregar a lixeira.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchTrash();
  }, []);

  const handlePermanentDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      await diagramService.permanentDeleteDiagram(id);
      setDiagrams((prev) => prev.filter((d) => d.id !== id));
      setSuccessMessage('Diagrama excluído permanentemente.');
      setTimeout(() => setSuccessMessage(null), 5000);
      setDiagramToDelete(null);
    } catch (err: any) {
      setError('Erro ao excluir o diagrama permanentemente.');
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRestore = async (id: string) => {
    try {
      await diagramService.restoreDiagram(id);
      setDiagrams((prev) => prev.filter((d) => d.id !== id));
      setSuccessMessage('Diagram successfully restored. Access My Diagrams to view it.');
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: any) {
      setError('Erro ao restaurar o diagrama.');
      console.error(err);
    }
  };

  const fontStack = "system-ui, -apple-system, BlinkMacSystemFont, sans-serif";

  return (
    <Box sx={{ minHeight: '100vh', fontFamily: fontStack }}>
      <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: '40px 32px' }}>
        {successMessage && (
          <Flash variant="success" sx={{ mb: 3 }}>
            {successMessage}
          </Flash>
        )}

        {error && (
          <Flash variant="danger" sx={{ mb: 3 }}>
            <AlertIcon /> {error}
          </Flash>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 1 }}>
          <Text as="h1" sx={{ fontSize: 5, fontWeight: 'bold', letterSpacing: '-0.02em', margin: 0 }}>
            Trash
          </Text>
          {!loading && diagrams.length > 0 && (
            <CounterLabel>{diagrams.length}</CounterLabel>
          )}
        </Box>
        <Text as="p" sx={{ fontSize: 1, color: 'fg.muted', marginBottom: 4 }}>
          Diagrams deleted. Permanent deletion cannot be undone.
        </Text>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', padding: '100px', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <Spinner size="large" />
            <Text sx={{ color: 'fg.muted', fontSize: 1 }}>Carregando lixeira...</Text>
          </Box>
        ) : diagrams.length === 0 ? (
          <EmptyState
            icon={TrashIcon}
            title="The trash can is empty"
            description="Deleted diagrams appear here before they are permanently removed."
          />
        ) : (
          <Box>
            {diagrams.map((diagram) => (
              <Box
                key={diagram.id}
                sx={{
                  bg: 'canvas.default',
                  border: '1px solid',
                  borderColor: 'border.default',
                  borderRadius: 2,
                  padding: 3,
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'default',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Box sx={{
                    width: '36px',
                    height: '36px',
                    borderRadius: 2,
                    bg: 'danger.subtle',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    color: 'danger.fg',
                  }}>
                    <FileCodeIcon size={16} />
                  </Box>
                  <Box>
                    <Text sx={{ fontWeight: 'bold', fontSize: 1, display: 'block', color: 'fg.default' }}>
                      {diagram.title}
                    </Text>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                      <Label variant="danger" size="small">{diagram.type}</Label>
                      <Text sx={{ color: 'fg.muted', fontSize: 0 }}>
                        Excluído em {diagram.updated_at ? new Date(diagram.updated_at).toLocaleDateString('pt-BR') : 'Data desconhecida'}
                      </Text>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, flexShrink: 0 }}>
                  <Button
                    size="small"
                    leadingVisual={ReplyIcon}
                    onClick={() => handleRestore(diagram.id)}
                    sx={{
                      backgroundColor: 'success.emphasis',
                      color: 'white',
                      borderColor: 'success.emphasis',
                      '&:hover:not([disabled])': {
                        backgroundColor: 'success.emphasis',
                        borderColor: 'success.emphasis',
                      },
                    }}
                  >
                    Restaurar
                  </Button>
                  <Button
                    size="small"
                    onClick={() => setDiagramToDelete(diagram)}
                    sx={{
                      backgroundColor: 'danger.emphasis',
                      color: 'white',
                      borderColor: 'danger.emphasis',
                      '&:hover:not([disabled])': {
                        backgroundColor: 'danger.emphasis',
                        borderColor: 'danger.emphasis',
                      },
                    }}
                  >
                    Excluir permanentemente
                  </Button>
                </Box>
              </Box>
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
              content: 'Cancelar',
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
