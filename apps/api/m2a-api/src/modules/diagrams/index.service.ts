import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../supabase/index.service';

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

  async save(diagram: {
    title: string;
    description: string;
    mermaid_code: string;
    created_by: string;
  }) {
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
    updateData: { title?: string; description?: string; mermaid_code?: string },
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
}
