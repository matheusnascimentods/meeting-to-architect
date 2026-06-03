import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/index.service';

@Injectable()
export class TeamDiagramsService {
  constructor(private readonly supabase: SupabaseService) {}

  async findByTeam(teamId: string, userId: string): Promise<any[]> {
    const member = await this.supabase
      .getClient()
      .from('Team_Members')
      .select('user_id')
      .eq('team_id', teamId)
      .eq('user_id', userId)
      .limit(1);

    if (!member.data || member.data.length === 0)
      throw new ForbiddenException('You are not a member of this team');

    const { data, error } = await this.supabase
      .getClient()
      .from('Diagrams')
      .select('*')
      .eq('team_id', teamId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false });

    if (error)
      throw new Error(`Failed to fetch team diagrams: ${error.message}`);
    return data ?? [];
  }

  async addToTeam(
    diagramId: string,
    teamId: string,
    userId: string,
  ): Promise<void> {
    const { data: members } = await this.supabase
      .getClient()
      .from('Team_Members')
      .select('role')
      .eq('team_id', teamId)
      .eq('user_id', userId)
      .limit(1);

    if (!members || members.length === 0)
      throw new ForbiddenException('You are not a member of this team');
    const member = members[0];

    if (member.role === 'admin') {
      await this.supabase
        .getClient()
        .from('Diagrams')
        .update({ team_id: teamId, updated_at: new Date().toISOString() })
        .eq('id', diagramId);
    } else {
      await this.supabase.getClient().from('Diagram_Approval_Requests').insert({
        diagram_id: diagramId,
        team_id: teamId,
        requested_by: userId,
        status: 'pending',
      });
    }
  }
}
