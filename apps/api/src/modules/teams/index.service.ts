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

    if (error) throw new Error(`Falha ao criar time: ${error.message}`);

    const { error: memberError } = await this.supabase
      .getClient()
      .from('Team_Members')
      .insert({ team_id: data.id, user_id: userId, role: 'admin' });

    if (memberError) {
      console.error('Erro ao adicionar membro:', memberError);
      throw new Error(
        `Falha ao vincular usuário ao time: ${memberError.message}`,
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
      console.error('Erro ao buscar times:', error);
      throw new Error(`Falha ao buscar times: ${error.message}`);
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

    if (error || !data || data.length === 0) throw new NotFoundException('Time não encontrado');
    return data[0];
  }

  async update(id: string, userId: string, dto: UpdateTeamDto): Promise<void> {
    await this.verifyAdmin(id, userId);

    const { error } = await this.supabase
      .getClient()
      .from('Teams')
      .update({ ...dto, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw new Error(`Falha ao atualizar time: ${error.message}`);
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.verifyAdmin(id, userId);

    const { error } = await this.supabase
      .getClient()
      .from('Teams')
      .delete()
      .eq('id', id);

    if (error) throw new Error(`Falha ao excluir time: ${error.message}`);
  }

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
      throw new NotFoundException('Usuário não encontrado com este email');

    const { error } = await this.supabase
      .getClient()
      .from('Team_Invites')
      .insert({
        team_id: teamId,
        invited_by: adminId,
        invited_user_id: user.id,
        status: 'pending',
      });

    if (error) throw new Error(`Falha ao convidar membro: ${error.message}`);
  }

  async getMyInvites(userId: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from('Team_Invites')
      .select('*, Teams(name)')
      .eq('invited_user_id', userId)
      .eq('status', 'pending');

    if (error) throw new Error(`Falha ao buscar convites: ${error.message}`);
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

    if (findError || !data) throw new NotFoundException('Convite não encontrado');

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

    if (error || !data || data.length === 0) throw new NotFoundException('Time não encontrado');
    if (data[0].role !== 'admin')
      throw new ForbiddenException('Apenas admins podem realizar esta ação');
  }
}
