// apps/web/src/shared/styles/tokens.ts
export const tokens = {
  layout: {
    maxWidth: 1200,
    containerPadding: '40px 32px',
    fontStack: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
  },
  text: {
    heading: { fontSize: 5, fontWeight: 'bold', letterSpacing: '-0.02em', margin: 0 },
    muted: { fontSize: 1, color: 'fg.muted' },
    small: { fontSize: 0, color: 'fg.muted' },
  },
  card: {
    base: {
      bg: 'canvas.default',
      border: '1px solid',
      borderColor: 'border.default',
      borderRadius: 2,
      padding: 3,
    },
  },
  container: {
    page: { maxWidth: 1200, margin: '0 auto', padding: '40px 32px' },
    centered: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
  },
} as const;
