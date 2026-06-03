import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/index.service';

@Injectable()
export class MembersService {
  constructor(private readonly supabase: SupabaseService) {}

  async getMembers(teamId: string, userId: string) {
    await this.verifyRole(teamId, userId, ['admin', 'maintainer', 'member']);

    const { data, error } = await this.supabase
      .getClient()
      .from('Team_Members')
      .select('team_id, user_id, role, joined_at, Users(id, name, email)')
      .eq('team_id', teamId);

    if (error) throw new Error(`Failed to fetch members: ${error.message}`);
    return data;
  }

  async updateMemberRole(
    teamId: string,
    adminId: string,
    memberUserId: string,
    role: 'admin' | 'member' | 'maintainer',
  ): Promise<void> {
    await this.verifyRole(teamId, adminId, ['admin']);

    const { error } = await this.supabase
      .getClient()
      .from('Team_Members')
      .update({ role })
      .eq('team_id', teamId)
      .eq('user_id', memberUserId);

    if (error) throw new Error(`Failed to update role: ${error.message}`);
  }

  async removeMember(
    teamId: string,
    adminId: string,
    memberUserId: string,
  ): Promise<void> {
    await this.verifyRole(teamId, adminId, ['admin']);

    const { error } = await this.supabase
      .getClient()
      .from('Team_Members')
      .delete()
      .eq('team_id', teamId)
      .eq('user_id', memberUserId);

    if (error) throw new Error(`Failed to remove member: ${error.message}`);
  }

  private async verifyRole(
    teamId: string,
    userId: string,
    allowedRoles: string[],
  ): Promise<void> {
    const { data, error } = await this.supabase
      .getClient()
      .from('Team_Members')
      .select('role')
      .eq('team_id', teamId)
      .eq('user_id', userId)
      .limit(1);

    if (error || !data || data.length === 0)
      throw new NotFoundException('Team not found');
    if (!allowedRoles.includes(data[0].role))
      throw new ForbiddenException('You do not have permission for this action');
  }
}
