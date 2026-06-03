import { z } from 'zod';

export const teamMemberSchema = z.object({
  team_id: z.string().uuid(),
  user_id: z.string().uuid(),
  role: z.enum(['admin', 'member', 'maintainer']),
  joined_at: z.string().optional(),
});

export type TeamMember = z.infer<typeof teamMemberSchema>;
