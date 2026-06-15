import { Box, Text, FormControl, TextInput, Button } from '@primer/react';
import React from 'react';
import { EmailStepProps } from './index.types';

export function EmailStep({ email, setEmail, onSubmit, loading, error }: EmailStepProps) {
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
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
        }}
      >
        <Box sx={{ mb: 4 }}>
          <Text sx={{ fontSize: 3, fontWeight: 'bold', mb: 1, display: 'block' }}>Welcome</Text>
          <Text sx={{ color: 'fg.muted', fontSize: 1, display: 'block' }}>Enter your email to continue</Text>
        </Box>
        <FormControl>
          <FormControl.Label visuallyHidden>Email</FormControl.Label>
          <TextInput
            type="email"
            placeholder="you@company.com"
            block
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {error && <FormControl.Validation variant="error">{error}</FormControl.Validation>}
        </FormControl>
        <Button variant="primary" sx={{ mt: 3, width: '100%' }} type="submit" loading={loading}>
          Continue
        </Button>
      </Box>
    </Box>
  );
}
