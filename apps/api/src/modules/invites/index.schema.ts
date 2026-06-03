import { z } from 'zod';

export const inviteMemberSchema = z.object({
  email: z.string().email(),
});

export const respondInviteSchema = z.object({
  accept: z.boolean(),
});

export type InviteMemberDto = z.infer<typeof inviteMemberSchema>;
export type RespondInviteDto = z.infer<typeof respondInviteSchema>;

export interface TeamInvite {
  id: string;
  team_id: string;
  invited_by: string;
  invited_user_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at?: string;
}
