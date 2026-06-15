import React, { createContext, useContext, useState, useCallback } from 'react';
import { Box, Flash, Text, IconButton } from '@primer/react';
import { XIcon, CheckIcon, AlertIcon, InfoIcon } from '@primer/octicons-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';
type ToastPosition = 'bottom-left' | 'bottom-right';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  position: ToastPosition;
}

interface ToastContextType {
  toast: (message: string, options?: { type?: ToastType, position?: ToastPosition, duration?: number }) => void;
  success: (message: string, options?: { position?: ToastPosition, duration?: number }) => void;
  error: (message: string, options?: { position?: ToastPosition, duration?: number }) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((message: string, options: { type?: ToastType, position?: ToastPosition, duration?: number } = {}) => {
    const id = Math.random().toString(36).substring(2, 9);
    const { type = 'info', position = 'bottom-right', duration = 5000 } = options;

    setToasts((prev) => [...prev, { id, message, type, position }]);

    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
  }, [removeToast]);

  const success = useCallback((message: string, options?: { position?: ToastPosition, duration?: number }) => {
    toast(message, { ...options, type: 'success' });
  }, [toast]);

  const error = useCallback((message: string, options?: { position?: ToastPosition, duration?: number }) => {
    toast(message, { ...options, type: 'error' });
  }, [toast]);

  const bottomLeftToasts = toasts.filter(t => t.position === 'bottom-left');
  const bottomRightToasts = toasts.filter(t => t.position === 'bottom-right');

  const renderToasts = (items: Toast[], isLeft: boolean) => (
    <Box
      sx={{
        position: 'fixed',
        bottom: 24,
        [isLeft ? 'left' : 'right']: 24,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        pointerEvents: 'none',
      }}
    >
      {items.map((t) => (
        <Box
          key={t.id}
          sx={{
            pointerEvents: 'auto',
            animation: 'toast-in 0.3s ease-out',
            '@keyframes toast-in': {
              from: { opacity: 0, transform: `translateY(10px)` },
              to: { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          <Flash
            variant={t.type === 'error' ? 'danger' : t.type === 'success' ? 'success' : 'default'}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              padding: '8px 12px',
              borderRadius: '8px',
              boxShadow: 'shadow.medium',
              minWidth: '200px',
              maxWidth: '400px',
            }}
          >
            {t.type === 'success' && <CheckIcon />}
            {t.type === 'error' && <AlertIcon />}
            {t.type === 'info' && <InfoIcon />}
            <Text sx={{ flex: 1, fontSize: 1 }}>{t.message}</Text>
            <IconButton
              icon={XIcon}
              aria-label="Close"
              variant="invisible"
              size="small"
              onClick={() => removeToast(t.id)}
              sx={{ color: 'inherit', p: 0, height: '20px', width: '20px' }}
            />
          </Flash>
        </Box>
      ))}
    </Box>
  );

  return (
    <ToastContext.Provider value={{ toast, success, error }}>
      {children}
      {renderToasts(bottomLeftToasts, true)}
      {renderToasts(bottomRightToasts, false)}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
