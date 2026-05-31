import React, { useEffect, useState } from 'react';
import { Box, Text, Button, Spinner, Flash, Dialog } from '@primer/react';
import { Blankslate } from '@primer/react/experimental';
import { TrashIcon, AlertIcon } from '@primer/octicons-react';
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
          <TrashIcon size={24} />
          <Text as="h2" sx={{ fontSize: 4, fontWeight: 'bold' }}>Trash</Text>
        </Box>
        <Text sx={{ color: 'fg.muted' }}>
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
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '40vh' }}>
          <Blankslate>
            <Blankslate.Visual>
              <TrashIcon size={40} />
            </Blankslate.Visual>
            <Blankslate.Heading>Lixeira vazia</Blankslate.Heading>
            <Blankslate.Description>Nenhum diagrama foi excluído ainda.</Blankslate.Description>
          </Blankslate>
        </Box>
      ) : (
        <Box>
          {diagrams.map((diagram) => (
            <Box
              key={diagram.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 3,
                bg: 'canvas.default',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'border.default',
                mb: 2,
              }}
            >
              <Box>
                <Text sx={{ fontWeight: 'bold', display: 'block' }}>{diagram.title}</Text>
                <Text sx={{ color: 'fg.muted', fontSize: 0 }}>
                  {diagram.type} · Excluído em {diagram.updated_at ? new Date(diagram.updated_at).toLocaleDateString('pt-BR') : 'Data desconhecida'}
                </Text>
              </Box>
              <Button
                variant="danger"
                size="small"
                onClick={() => setDiagramToDelete(diagram)}
              >
                Excluir permanentemente
              </Button>
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
