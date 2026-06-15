import React from 'react';

export interface SignupStepProps {
  email: string;
  name: string;
  setName: (name: string) => void;
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (password: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  loading: boolean;
  errors: {
    name?: string;
    password?: string;
    confirmPassword?: string;
  };
}
