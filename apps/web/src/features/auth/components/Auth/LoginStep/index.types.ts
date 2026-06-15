import React from 'react';
import { User } from '../../../types';

export interface LoginStepProps {
  currentUser: User | null;
  password: string;
  setPassword: (password: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  loading: boolean;
  error: string;
}
