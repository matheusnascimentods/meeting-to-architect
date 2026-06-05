import { Box, Text, FormControl, TextInput, Button, IconButton } from '@primer/react';
import { ArrowLeftIcon } from '@primer/octicons-react';
import React from 'react';

interface Props {
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

export function SignupStep({
  email,
  name,
  setName,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  onSubmit,
  onBack,
  loading,
  errors
}: Props) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: 400 }}>
      <Box
        as="form"
        onSubmit={onSubmit}
        sx={{
          bg: 'canvas.default',
          p: 5,
          borderRadius: '16px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          width: '100%',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
        }}
      >
        <IconButton
          icon={ArrowLeftIcon}
          aria-label="Back"
          variant="invisible"
          onClick={onBack}
          sx={{ position: 'absolute', top: 2, left: 2 }}
        />
        <Box sx={{ mt: 4, mb: 4 }}>
          <Text sx={{ fontSize: 2, fontWeight: 'bold', mb: 1, display: 'block' }}>Create your account</Text>
          <Text sx={{ color: 'fg.muted', fontSize: 1, display: 'block' }}>
            No account found for this email. Fill in the details below.
          </Text>
        </Box>

        <FormControl sx={{ mb: 2 }}>
          <FormControl.Label>Full name</FormControl.Label>
          <TextInput
            placeholder="Your full name"
            block
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <FormControl.Validation variant="error">{errors.name}</FormControl.Validation>}
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
          {errors.password && <FormControl.Validation variant="error">{errors.password}</FormControl.Validation>}
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
          {errors.confirmPassword && <FormControl.Validation variant="error">{errors.confirmPassword}</FormControl.Validation>}
        </FormControl>

        <Button variant="primary" sx={{ width: '100%' }} type="submit" loading={loading}>
          Create account
        </Button>
      </Box>
    </Box>
  );
}
