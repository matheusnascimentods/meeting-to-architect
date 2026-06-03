import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/index.service';

@Injectable()
export class InvitesService {
  constructor(private readonly supabase: SupabaseService) {}

  async inviteMember(
    teamId: string,
    invitedEmail: string,
    adminId: string,
  ): Promise<void> {
    await this.verifyAdmin(teamId, adminId);

    const { data: user } = await this.supabase
      .getClient()
      .from('Users')
      .select('id')
      .eq('email', invitedEmail)
      .single();

    if (!user)
      throw new NotFoundException('User not found with this email');

    const { error } = await this.supabase
      .getClient()
      .from('Team_Invites')
      .insert({
        team_id: teamId,
        invited_by: adminId,
        invited_user_id: user.id,
        status: 'pending',
      });

    if (error) throw new Error(`Failed to invite member: ${error.message}`);
  }

  async getMyInvites(userId: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from('Team_Invites')
      .select('*, Teams(name)')
      .eq('invited_user_id', userId)
      .eq('status', 'pending');

    if (error) throw new Error(`Failed to fetch invites: ${error.message}`);
    return data ?? [];
  }

  async respondInvite(
    inviteId: string,
    userId: string,
    accept: boolean,
  ): Promise<void> {
    const { data, error: findError } = await this.supabase
      .getClient()
      .from('Team_Invites')
      .select('*')
      .eq('id', inviteId)
      .eq('invited_user_id', userId)
      .single();

    if (findError || !data)
      throw new NotFoundException('Invite not found');

    await this.supabase
      .getClient()
      .from('Team_Invites')
      .update({ status: accept ? 'accepted' : 'rejected' })
      .eq('id', inviteId);

    if (accept) {
      const { data: existing } = await this.supabase
        .getClient()
        .from('Team_Members')
        .select('id')
        .eq('team_id', data.team_id)
        .eq('user_id', userId)
        .limit(1);

      if (!existing || existing.length === 0) {
        await this.supabase
          .getClient()
          .from('Team_Members')
          .insert({ team_id: data.team_id, user_id: userId, role: 'member' });
      }
    }
  }

  private async verifyAdmin(teamId: string, userId: string): Promise<void> {
    const { data, error } = await this.supabase
      .getClient()
      .from('Team_Members')
      .select('role')
      .eq('team_id', teamId)
      .eq('user_id', userId)
      .limit(1);

    if (error || !data || data.length === 0)
      throw new NotFoundException('Team not found');
    if (data[0].role !== 'admin')
      throw new ForbiddenException('You do not have permission for this action');
  }
}
