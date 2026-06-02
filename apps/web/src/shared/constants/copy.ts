// apps/web/src/shared/constants/copy.ts
export const COPY = {
  diagrams: {
    title: 'Diagrams',
    subtitle: 'All architecture diagrams generated from your meeting transcripts',
    empty: {
      title: 'No diagrams yet',
      description: 'Upload a meeting transcript to generate your first architecture diagram.',
      action: 'Generate Diagram',
    },
    loading: 'Loading your workspace...',
    error: 'Falha ao carregar diagramas',
  },
  trash: {
    title: 'Trash',
    subtitle: 'Diagramas excluídos. A exclusão permanente não pode ser desfeita.',
    empty: {
      title: 'Lixeira vazia',
      description: 'Os diagramas excluídos aparecem aqui antes da remoção permanente.',
      action: 'Ir para My Diagrams',
    },
    loading: 'Carregando lixeira...',
    error: 'Falha ao carregar lixeira',
    clearSuccess: 'Lixeira esvaziada com sucesso',
    restoreSuccess: 'Diagrama restaurado com sucesso',
  },
  teams: {
    title: 'Teams',
    subtitle: 'Collaborate with your colleagues on architecture diagrams',
    invites: 'Meus Convites',
    requests: 'Solicitações pendentes',
    loading: 'Loading your teams...',
    error: 'Falha ao carregar times',
    empty: {
      title: 'Nenhum time encontrado',
      description: 'Crie um time ou peça para ser convidado para um.',
      action: 'Criar Time',
    }
  },
  common: {
    loading: 'Carregando...',
    error: 'Ocorreu um erro inesperado',
    delete: 'Excluir',
    cancel: 'Cancelar',
    save: 'Salvar',
    back: 'Voltar',
  }
} as const;
