import { z } from 'zod';

export const addToTeamSchema = z.object({
  team_id: z.string().uuid(),
});

export type AddToTeamDto = z.infer<typeof addToTeamSchema>;
