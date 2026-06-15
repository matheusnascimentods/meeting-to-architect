import { User } from '@/features/auth/types';

export type AuthState = 'auth-email' | 'auth-login' | 'auth-signup' | 'app';

export interface AuthFlowProps {
  onAuthenticated: (user: User) => void;
}
