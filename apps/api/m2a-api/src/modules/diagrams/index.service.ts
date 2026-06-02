import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/index.service';
import { CreateDiagramDto } from './index.schema';

@Injectable()
export class DiagramsService {
  constructor(private readonly supabase: SupabaseService) {}

  async findAll(userId: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from('Diagrams')
      .select('*')
      .eq('created_by', userId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching diagrams:', error);
      throw new Error(`Failed to fetch diagrams: ${error.message}`);
    }
    return data;
  }

  async getDeletedByUser(userId: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from('Diagrams')
      .select('*')
      .eq('created_by', userId)
      .eq('is_deleted', true)
      .order('updated_at', { ascending: false });

    if (error) throw new Error(`Falha ao buscar lixeira: ${error.message}`);
    return data ?? [];
  }

  async permanentDelete(id: string, userId: string): Promise<void> {
    const { data, error: findError } = await this.supabase
      .getClient()
      .from('Diagrams')
      .select('id, created_by')
      .eq('id', id)
      .single();

    if (findError || !data)
      throw new NotFoundException('Diagrama não encontrado');
    if (data.created_by !== userId)
      throw new ForbiddenException('Sem permissão para excluir este diagrama');

    const { error } = await this.supabase
      .getClient()
      .from('Diagrams')
      .delete()
      .eq('id', id);

    if (error)
      throw new Error(`Falha ao excluir permanentemente: ${error.message}`);
  }

  async restore(id: string, userId: string): Promise<void> {
    const { data, error: findError } = await this.supabase
      .getClient()
      .from('Diagrams')
      .select('id, created_by')
      .eq('id', id)
      .single();

    if (findError || !data)
      throw new NotFoundException('Diagrama não encontrado');
    if (data.created_by !== userId)
      throw new ForbiddenException(
        'Sem permissão para restaurar este diagrama',
      );

    const { error } = await this.supabase
      .getClient()
      .from('Diagrams')
      .update({ is_deleted: false, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw new Error(`Falha ao restaurar diagrama: ${error.message}`);
  }

  async softDelete(id: string, userId: string): Promise<void> {
    const { data, error: findError } = await this.supabase
      .getClient()
      .from('Diagrams')
      .select('id, created_by')
      .eq('id', id)
      .single();

    if (findError || !data)
      throw new NotFoundException('Diagrama não encontrado');
    if (data.created_by !== userId)
      throw new ForbiddenException('Sem permissão para excluir este diagrama');

    const { error } = await this.supabase
      .getClient()
      .from('Diagrams')
      .update({ is_deleted: true, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw new Error(`Falha ao excluir diagrama: ${error.message}`);
  }

  async save(diagram: CreateDiagramDto) {
    const { data, error } = await this.supabase
      .getClient()
      .from('Diagrams')
      .insert([diagram])
      .select()
      .single();

    if (error) {
      console.error('Error saving diagram:', error);
      throw new Error(`Failed to save diagram: ${error.message}`);
    }
    return data;
  }

  async update(
    id: string,
    userId: string,
    updateData: {
      title?: string;
      description?: string;
      mermaid_code?: string;
      type?: string;
    },
  ) {
    const { data, error } = await this.supabase
      .getClient()
      .from('Diagrams')
      .update(updateData)
      .eq('id', id)
      .eq('created_by', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating diagram:', error);
      throw new Error(`Failed to update diagram: ${error.message}`);
    }
    return data;
  }

  async remove(id: string, userId: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from('Diagrams')
      .delete()
      .eq('id', id)
      .eq('created_by', userId)
      .select()
      .single();

    if (error) {
      console.error('Error deleting diagram:', error);
      throw new Error(`Failed to delete diagram: ${error.message}`);
    }
    return data;
  }

  async findByTeam(teamId: string, userId: string): Promise<any[]> {
    const member = await this.supabase
      .getClient()
      .from('Team_Members')
      .select('user_id')
      .eq('team_id', teamId)
      .eq('user_id', userId)
      .single();

    if (!member.data)
      throw new ForbiddenException('Você não faz parte deste time');

    const { data, error } = await this.supabase
      .getClient()
      .from('Diagrams')
      .select('*')
      .eq('team_id', teamId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false });

    if (error)
      throw new Error(`Falha ao buscar diagramas do time: ${error.message}`);
    return data ?? [];
  }

  async addToTeam(
    diagramId: string,
    teamId: string,
    userId: string,
  ): Promise<void> {
    const { data: member } = await this.supabase
      .getClient()
      .from('Team_Members')
      .select('role')
      .eq('team_id', teamId)
      .eq('user_id', userId)
      .single();

    if (!member) throw new ForbiddenException('Você não faz parte deste time');

    if (member.role === 'admin') {
      await this.supabase
        .getClient()
        .from('Diagrams')
        .update({ team_id: teamId, updated_at: new Date().toISOString() })
        .eq('id', diagramId);
    } else {
      await this.supabase
        .getClient()
        .from('Diagram_Approval_Requests')
        .insert({
          diagram_id: diagramId,
          team_id: teamId,
          requested_by: userId,
          status: 'pending',
        });
    }
  }

  async getTeamRequests(teamId: string, userId: string) {
    await this.verifyAdmin(teamId, userId);

    const { data, error } = await this.supabase
      .getClient()
      .from('Diagram_Approval_Requests')
      .select('*, Diagrams(title, type), Users!requested_by(name, email)')
      .eq('team_id', teamId)
      .eq('status', 'pending');

    if (error)
      throw new Error(`Falha ao buscar solicitações: ${error.message}`);
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

    if (error || !data) throw new NotFoundException('Solicitação não encontrada');
    await this.verifyAdmin(data.team_id, adminId);

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

  private async verifyAdmin(teamId: string, userId: string): Promise<void> {
    const { data, error } = await this.supabase
      .getClient()
      .from('Team_Members')
      .select('role')
      .eq('team_id', teamId)
      .eq('user_id', userId)
      .single();

    if (error || !data) throw new NotFoundException('Time não encontrado');
    if (data.role !== 'admin')
      throw new ForbiddenException('Apenas admins podem realizar esta ação');
  }
}
