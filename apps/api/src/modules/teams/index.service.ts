import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/index.service';
import { CreateTeamDto, UpdateTeamDto, Team } from './index.schema';

@Injectable()
export class TeamsService {
  constructor(private readonly supabase: SupabaseService) {}

  async create(dto: CreateTeamDto, userId: string): Promise<Team> {
    const { data, error } = await this.supabase
      .getClient()
      .from('Teams')
      .insert({ name: dto.name, created_by: userId })
      .select()
      .single();

    if (error) throw new Error(`Failed to create team: ${error.message}`);

    const { error: memberError } = await this.supabase
      .getClient()
      .from('Team_Members')
      .insert({ team_id: data.id, user_id: userId, role: 'admin' });

    if (memberError) {
      console.error('Error adding member:', memberError);
      throw new Error(
        `Failed to link user to team: ${memberError.message}`,
      );
    }

    return data;
  }

  async findAllByUser(userId: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from('Team_Members')
      .select('team_id, role, Teams (*)')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching teams:', error);
      throw new Error(`Failed to fetch teams: ${error.message}`);
    }

    if (!data) return [];

    // Filter duplicates by team_id to avoid UI issues with legacy data
    const uniqueTeams = Array.from(
      new Map(data.map((item) => [item.team_id, item])).values(),
    );

    return uniqueTeams;
  }

  async findById(id: string, userId: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from('Team_Members')
      .select('role, Teams(*)')
      .eq('team_id', id)
      .eq('user_id', userId)
      .limit(1);

    if (error || !data || data.length === 0)
      throw new NotFoundException('Team not found');
    return data[0];
  }

  async update(id: string, userId: string, dto: UpdateTeamDto): Promise<void> {
    await this.verifyAdmin(id, userId);

    const { error } = await this.supabase
      .getClient()
      .from('Teams')
      .update({ ...dto, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw new Error(`Failed to update team: ${error.message}`);
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.verifyAdmin(id, userId);

    const { error } = await this.supabase
      .getClient()
      .from('Teams')
      .delete()
      .eq('id', id);

    if (error) throw new Error(`Failed to delete team: ${error.message}`);
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

  private async verifyAdmin(teamId: string, userId: string): Promise<void> {
    return this.verifyRole(teamId, userId, ['admin']);
  }
}
