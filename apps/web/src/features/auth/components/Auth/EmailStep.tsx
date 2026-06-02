import { Box, Text, FormControl, TextInput, Button } from '@primer/react';
import React from 'react';

interface Props {
  email: string;
  setEmail: (email: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  error: string;
}

export function EmailStep({ email, setEmail, onSubmit, loading, error }: Props) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: 400 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Text sx={{ fontSize: 40, fontWeight: 'bold', display: 'block' }}>M2A</Text>
        <Text sx={{ color: 'fg.muted', fontSize: 1 }}>Meeting to Architecture</Text>
      </Box>
      <Box
        as="form"
        onSubmit={onSubmit}
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
          {error && <FormControl.Validation variant="error">{error}</FormControl.Validation>}
        </FormControl>
        <Button variant="primary" block sx={{ mt: 3 }} type="submit" loading={loading}>
          Continue
        </Button>
      </Box>
    </Box>
  );
}
