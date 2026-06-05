import { Box, Text, FormControl, TextInput, Button, IconButton } from '@primer/react';
import { ArrowLeftIcon } from '@primer/octicons-react';
import React from 'react';
import { User } from '../../types';

interface Props {
  currentUser: User | null;
  password: string;
  setPassword: (password: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  loading: boolean;
  error: string;
}

export function LoginStep({ currentUser, password, setPassword, onSubmit, onBack, loading, error }: Props) {
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
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
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
          <Text sx={{ color: 'fg.muted', fontSize: 1 }}>{currentUser?.email}</Text>
        </Box>

        <FormControl sx={{ width: '100%' }}>
          <FormControl.Label>Password</FormControl.Label>
          <TextInput
            type="password"
            placeholder="Enter your password"
            block
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <FormControl.Validation variant="error">{error}</FormControl.Validation>}
        </FormControl>

        <Button variant="primary" sx={{ mt: 3, width: '100%' }} type="submit" loading={loading}>
          Sign in
        </Button>
      </Box>
    </Box>
  );
}
