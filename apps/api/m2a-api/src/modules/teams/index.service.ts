import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
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

    await this.supabase
      .getClient()
      .from('Team_Members')
      .insert({ team_id: data.id, user_id: userId, role: 'admin' });

    return data;
  }

  async findAllByUser(userId: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from('Team_Members')
      .select('team_id, role, Teams(*)')
      .eq('user_id', userId);

    if (error) throw new Error(`Falha ao buscar times: ${error.message}`);
    return data ?? [];
  }

  async findById(id: string, userId: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from('Team_Members')
      .select('role, Teams(*)')
      .eq('team_id', id)
      .eq('user_id', userId)
      .single();

    if (error || !data) throw new NotFoundException('Time não encontrado');
    return data;
  }

  async update(id: string, userId: string, dto: UpdateTeamDto): Promise<void> {
    await this.verifyAdmin(id, userId)

    const { error } = await this.supabase
      .getClient()
      .from('Teams')
      .update({ ...dto, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw new Error(`Falha ao atualizar time: ${error.message}`);
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.verifyAdmin(id, userId)

    const { error } = await this.supabase
      .getClient()
      .from('Teams')
      .delete()
      .eq('id', id);

    if (error) throw new Error(`Falha ao excluir time: ${error.message}`);
  }

  private async verifyAdmin(teamId: string, userId: string): Promise<void> {
    const { data, error } = await this.supabase
      .getClient()
      .from('Team_Members')
      .select('role')
      .eq('team_id', teamId)
      .eq('user_id', userId)
      .single();

    if (error || !data) throw new NotFoundException('Time não encontrado');
    if (data.role !== 'admin') throw new ForbiddenException('Apenas admins podem realizar esta ação');
  }
}
