import React, { useState } from 'react';
import { Box, Text, FormControl, TextInput, Button, IconButton } from '@primer/react';
import { ArrowLeftIcon } from '@primer/octicons-react';
import { authService } from '../../services/auth.service';
import { User } from '../../types/auth';

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
    } catch (error: any) {
      if (error.response?.status === 401) {
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
    } catch (error: any) {
      if (error.response?.status === 409) {
        setPasswordError('An account with this email already exists.');
      } else {
        setPasswordError('Something went wrong. Try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderEmailStep = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: 400 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Text sx={{ fontSize: 40, fontWeight: 'bold', display: 'block' }}>M2A</Text>
        <Text sx={{ color: 'fg.muted', fontSize: 1 }}>Meeting to Architecture</Text>
      </Box>
      <Box
        as="form"
        onSubmit={handleEmailSubmit}
        sx={{
          bg: 'canvas.default',
          p: 5,
          borderRadius: '16px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          width: '100%',
        }}
      >
        <Text sx={{ fontSize: 3, fontWeight: 'bold', mb: 1, display: 'block' }}>Welcome</Text>
        <Text sx={{ color: 'fg.muted', fontSize: 1, mb: 4, display: 'block' }}>Enter your email to continue</Text>
        <FormControl>
          <TextInput
            type="email"
            placeholder="you@company.com"
            block
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailError && <FormControl.Validation variant="error">{emailError}</FormControl.Validation>}
        </FormControl>
        <Button variant="primary" block sx={{ mt: 3 }} type="submit" loading={loading}>
          Continue
        </Button>
      </Box>
    </Box>
  );

  const renderLoginStep = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: 400 }}>
      <Box
        as="form"
        onSubmit={handleLoginSubmit}
        sx={{
          bg: 'canvas.default',
          p: 5,
          borderRadius: '16px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          width: '100%',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <IconButton
          icon={ArrowLeftIcon}
          aria-label="Back"
          variant="invisible"
          onClick={() => setStep('email')}
          sx={{ position: 'absolute', top: 2, left: 2 }}
        />
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            bg: 'accent.subtle',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
            mt: 2,
          }}
        >
          <Text sx={{ color: 'accent.fg', fontWeight: 'bold' }}>{currentUser?.name?.[0] || '?'}</Text>
        </Box>
        <Text sx={{ fontWeight: 'bold', fontSize: 2 }}>{currentUser?.name}</Text>
        <Text sx={{ color: 'fg.muted', fontSize: 1, mb: 4 }}>{currentUser?.email}</Text>

        <FormControl sx={{ width: '100%' }}>
          <FormControl.Label>Password</FormControl.Label>
          <TextInput
            type="password"
            placeholder="Enter your password"
            block
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {passwordError && <FormControl.Validation variant="error">{passwordError}</FormControl.Validation>}
        </FormControl>

        <Button variant="primary" block sx={{ mt: 3 }} type="submit" loading={loading}>
          Sign in
        </Button>
        <Text sx={{ color: 'fg.muted', fontSize: 0, mt: 3, cursor: 'pointer' }}>Forgot your password?</Text>
      </Box>
    </Box>
  );

  const renderSignupStep = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: 400 }}>
      <Box
        as="form"
        onSubmit={handleSignupSubmit}
        sx={{
          bg: 'canvas.default',
          p: 5,
          borderRadius: '16px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          width: '100%',
          position: 'relative',
        }}
      >
        <IconButton
          icon={ArrowLeftIcon}
          aria-label="Back"
          variant="invisible"
          onClick={() => setStep('email')}
          sx={{ position: 'absolute', top: 2, left: 2 }}
        />
        <Text sx={{ fontSize: 2, fontWeight: 'bold', mb: 1, display: 'block', mt: 4 }}>Create your account</Text>
        <Text sx={{ color: 'fg.muted', fontSize: 1, mb: 4, display: 'block' }}>
          No account found for this email. Fill in the details below.
        </Text>

        <FormControl sx={{ mb: 2 }}>
          <FormControl.Label>Full name</FormControl.Label>
          <TextInput
            placeholder="Your full name"
            block
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {nameError && <FormControl.Validation variant="error">{nameError}</FormControl.Validation>}
        </FormControl>

        <FormControl sx={{ mb: 2 }}>
          <FormControl.Label>Email</FormControl.Label>
          <TextInput value={email} disabled block />
        </FormControl>

        <FormControl sx={{ mb: 2 }}>
          <FormControl.Label>Password</FormControl.Label>
          <TextInput
            type="password"
            placeholder="Create a password"
            block
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {passwordError && <FormControl.Validation variant="error">{passwordError}</FormControl.Validation>}
        </FormControl>

        <FormControl sx={{ mb: 3 }}>
          <FormControl.Label>Confirm password</FormControl.Label>
          <TextInput
            type="password"
            placeholder="Repeat your password"
            block
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {confirmPasswordError && <FormControl.Validation variant="error">{confirmPasswordError}</FormControl.Validation>}
        </FormControl>

        <Button variant="primary" block type="submit" loading={loading}>
          Create account
        </Button>
      </Box>
    </Box>
  );

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
      {step === 'email' && renderEmailStep()}
      {step === 'login' && renderLoginStep()}
      {step === 'signup' && renderSignupStep()}
    </Box>
  );
}
