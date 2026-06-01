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

export const teamMemberSchema = z.object({
  team_id: z.string().uuid(),
  user_id: z.string().uuid(),
  role: z.enum(['admin', 'member']),
  joined_at: z.string().optional(),
});

export const inviteMemberSchema = z.object({
  email: z.string().email(),
});

export const teamInviteSchema = z.object({
  id: z.string().uuid(),
  team_id: z.string().uuid(),
  invited_by: z.string().uuid(),
  invited_email: z.string().email(),
  status: z.enum(['pending', 'accepted', 'rejected']),
  created_at: z.string().optional(),
});

export type CreateTeamDto = z.infer<typeof createTeamSchema>;
export type UpdateTeamDto = z.infer<typeof updateTeamSchema>;
export type Team = z.infer<typeof teamSchema>;
export type TeamMember = z.infer<typeof teamMemberSchema>;
export type InviteMemberDto = z.infer<typeof inviteMemberSchema>;
export type TeamInvite = z.infer<typeof teamInviteSchema>;
