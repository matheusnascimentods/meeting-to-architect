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
    error: 'Failed to load diagrams',
  },
  trash: {
    title: 'Trash',
    subtitle: 'Deleted diagrams. Permanent deletion cannot be undone.',
    empty: {
      title: 'Empty trash',
      description: 'Deleted diagrams appear here before permanent removal.',
      action: 'Go to My Diagrams',
    },
    loading: 'Loading trash...',
    error: 'Failed to load trash',
    clearSuccess: 'Trash cleared successfully',
    restoreSuccess: 'Diagram restored successfully',
  },
  teams: {
    title: 'Teams',
    subtitle: 'Collaborate with your colleagues on architecture diagrams',
    invites: 'My Invitations',
    requests: 'Pending requests',
    loading: 'Loading your teams...',
    error: 'Failed to load teams',
    empty: {
      title: 'No teams found',
      description: 'Create a team or ask to be invited to one.',
      action: 'Create Team',
    }
  },
  common: {
    loading: 'Loading...',
    error: 'An unexpected error occurred',
    delete: 'Delete',
    cancel: 'Cancel',
    save: 'Save',
    back: 'Back',
  }
} as const;
