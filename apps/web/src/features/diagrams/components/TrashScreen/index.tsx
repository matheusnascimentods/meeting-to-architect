import React, { useEffect, useState } from 'react';
import { Box, Text, Button, Spinner, Flash, Dialog, Heading, CounterLabel, Label } from '@primer/react';
import { TrashIcon, AlertIcon, FileCodeIcon, ReplyIcon } from '@primer/octicons-react';
import { diagramService } from '../../services/diagram.service';
import { Diagram } from '../../types';

export function TrashScreen() {
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
      setSuccessMessage('Diagrama restaurado com sucesso. Acesse My Diagrams para visualizá-lo.');
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (err: any) {
      setError('Erro ao restaurar o diagrama.');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Spinner size="large" />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <TrashIcon size={20} />
          <Heading as="h2" sx={{ fontSize: 3 }}>Trash</Heading>
          {diagrams.length > 0 && (
            <CounterLabel>{diagrams.length}</CounterLabel>
          )}
        </Box>
        <Text sx={{ color: 'fg.muted', fontSize: 1 }}>
          Diagramas excluídos. A exclusão permanente não pode ser desfeita.
        </Text>
      </Box>

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

      {diagrams.length === 0 ? (
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '60vh',
          gap: 3,
        }}>
          <Box sx={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            bg: 'canvas.subtle',
            border: '1px solid',
            borderColor: 'border.default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <TrashIcon size={28} />
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Text as="p" sx={{ fontWeight: 'bold', fontSize: 2, color: 'fg.default' }}>
              Lixeira vazia
            </Text>
            <Text as="p" sx={{ color: 'fg.muted', fontSize: 1, mt: 1 }}>
              Os diagramas excluídos aparecem aqui antes da remoção permanente.
            </Text>
          </Box>
        </Box>
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
                transition: 'box-shadow 0.15s ease',
                ':hover': {
                  boxShadow: 'shadow.medium',
                },
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
                  variant="default"
                  size="small"
                  leadingVisual={ReplyIcon}
                  onClick={() => handleRestore(diagram.id)}
                >
                  Restaurar
                </Button>
                <Button
                  variant="danger"
                  size="small"
                  onClick={() => setDiagramToDelete(diagram)}
                >
                  Excluir permanentemente
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
      )}

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
