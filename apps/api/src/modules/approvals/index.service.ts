import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/index.service';

@Injectable()
export class ApprovalsService {
  constructor(private readonly supabase: SupabaseService) {}

  async getTeamRequests(teamId: string, userId: string) {
    const { data: members, error: memberError } = await this.supabase
      .getClient()
      .from('Team_Members')
      .select('role')
      .eq('team_id', teamId)
      .eq('user_id', userId)
      .limit(1);

    if (memberError || !members || members.length === 0)
      throw new ForbiddenException('You are not a member of this team');

    const member = members[0];

    if (member.role !== 'admin' && member.role !== 'maintainer') return [];

    const { data, error } = await this.supabase
      .getClient()
      .from('Diagram_Approval_Requests')
      .select('*, Diagrams(title, type), Users!requested_by(name, email)')
      .eq('team_id', teamId)
      .eq('status', 'pending');

    if (error)
      throw new Error(`Failed to fetch requests: ${error.message}`);
    return data ?? [];
  }

  async respondRequest(
    requestId: string,
    adminId: string,
    approve: boolean,
  ): Promise<void> {
    const { data, error } = await this.supabase
      .getClient()
      .from('Diagram_Approval_Requests')
      .select('*')
      .eq('id', requestId)
      .single();

    if (error || !data)
      throw new NotFoundException('Request not found');

    await this.verifyRole(data.team_id, adminId, ['admin', 'maintainer']);

    await this.supabase
      .getClient()
      .from('Diagram_Approval_Requests')
      .update({
        status: approve ? 'approved' : 'rejected',
        reviewed_by: adminId,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', requestId);

    if (approve) {
      await this.supabase
        .getClient()
        .from('Diagrams')
        .update({ team_id: data.team_id, updated_at: new Date().toISOString() })
        .eq('id', data.diagram_id);
    }
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
