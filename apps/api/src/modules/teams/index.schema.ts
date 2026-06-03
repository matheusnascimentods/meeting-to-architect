import { z } from 'zod';

export const createTeamSchema = z.object({
  name: z.string().min(2),
});

export const updateTeamSchema = z.object({
  name: z.string().min(2).optional(),
});

export const teamSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  created_by: z.string().uuid(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type CreateTeamDto = z.infer<typeof createTeamSchema>;
export type UpdateTeamDto = z.infer<typeof updateTeamSchema>;
export type Team = z.infer<typeof teamSchema>;
