import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
});

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  password_hash: z.string(),
  created_at: z.string().optional(),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
export type User = z.infer<typeof userSchema>;
