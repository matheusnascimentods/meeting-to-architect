import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/index.service';

@Injectable()
export class TrashService {
  constructor(private readonly supabase: SupabaseService) {}

  async getDeletedByUser(userId: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from('Diagrams')
      .select('*')
      .eq('created_by', userId)
      .eq('is_deleted', true)
      .order('updated_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch trash: ${error.message}`);
    return data ?? [];
  }

  async restore(id: string, userId: string): Promise<void> {
    const { data, error: findError } = await this.supabase
      .getClient()
      .from('Diagrams')
      .select('id, created_by')
      .eq('id', id)
      .single();

    if (findError || !data)
      throw new NotFoundException('Diagram not found');
    if (data.created_by !== userId)
      throw new ForbiddenException(
        'No permission to restore this diagram',
      );

    const { error } = await this.supabase
      .getClient()
      .from('Diagrams')
      .update({ is_deleted: false, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw new Error(`Failed to restore diagram: ${error.message}`);
  }

  async permanentDelete(id: string, userId: string): Promise<void> {
    const { data, error: findError } = await this.supabase
      .getClient()
      .from('Diagrams')
      .select('id, created_by')
      .eq('id', id)
      .single();

    if (findError || !data)
      throw new NotFoundException('Diagram not found');
    if (data.created_by !== userId)
      throw new ForbiddenException('No permission to delete this diagram');

    const { error } = await this.supabase
      .getClient()
      .from('Diagrams')
      .delete()
      .eq('id', id);

    if (error)
      throw new Error(`Failed to permanently delete: ${error.message}`);
  }
}
