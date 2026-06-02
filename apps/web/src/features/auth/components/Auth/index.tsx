import React, { useState } from 'react';
import { Box } from '@primer/react';
import { authService } from '@/features/auth/services/auth.service';
import { User } from '@/features/auth/types';
import { EmailStep } from './EmailStep';
import { LoginStep } from './LoginStep';
import { SignupStep } from './SignupStep';

export type AuthState = 'auth-email' | 'auth-login' | 'auth-signup' | 'app';

interface AuthFlowProps {
  onAuthenticated: (user: User) => void;
}

export function AuthFlow({ onAuthenticated }: AuthFlowProps) {
  const [step, setStep] = useState<'email' | 'login' | 'signup'>('email');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    if (!email || !email.includes('@')) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const user = await authService.checkEmail(email);
      if (user && user.email) {
        setCurrentUser(user);
        setStep('login');
      } else {
        setStep('signup');
      }
    } catch (error) {
      setEmailError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    if (!password) {
      setPasswordError('Password is required');
      return;
    }

    setLoading(true);
    try {
      const data = await authService.login(email, password);
      localStorage.setItem('token', data.access_token || data.token);
      onAuthenticated(data.user || { email, name: currentUser?.name || '' });
    } catch (error: unknown) {
      if (error instanceof Error && (error as any).response?.status === 401) {
        setPasswordError('Incorrect password. Try again.');
      } else {
        setPasswordError('Something went wrong. Try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameError('');
    setPasswordError('');
    setConfirmPasswordError('');

    let hasError = false;
    if (!name) {
      setNameError('Name is required');
      hasError = true;
    }
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      hasError = true;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);
    try {
      const data = await authService.register(email, password, name);
      localStorage.setItem('token', data.access_token || data.token);
      onAuthenticated(data.user || { email, name });
    } catch (error: unknown) {
      if (error instanceof Error && (error as any).response?.status === 409) {
        setPasswordError('An account with this email already exists.');
      } else {
        setPasswordError('Something went wrong. Try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bg: 'canvas.subtle',
        px: 4,
      }}
    >
      {step === 'email' && (
        <EmailStep
          email={email}
          setEmail={setEmail}
          onSubmit={handleEmailSubmit}
          loading={loading}
          error={emailError}
        />
      )}
      {step === 'login' && (
        <LoginStep
          currentUser={currentUser}
          password={password}
          setPassword={setPassword}
          onSubmit={handleLoginSubmit}
          onBack={() => setStep('email')}
          loading={loading}
          error={passwordError}
        />
      )}
      {step === 'signup' && (
        <SignupStep
          email={email}
          name={name}
          setName={setName}
          password={password}
          setPassword={setPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          onSubmit={handleSignupSubmit}
          onBack={() => setStep('email')}
          loading={loading}
          errors={{
            name: nameError,
            password: passwordError,
            confirmPassword: confirmPasswordError
          }}
        />
      )}
    </Box>
  );
}
