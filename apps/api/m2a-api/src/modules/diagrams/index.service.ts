import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/index.service';

@Injectable()
export class DiagramsService {
  constructor(private readonly supabase: SupabaseService) {}

  async findAll(userId: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from('Diagrams')
      .select('*')
      .eq('createdByUser', userId)
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Error fetching diagrams:', error);
      throw new Error(`Failed to fetch diagrams: ${error.message}`);
    }
    return data;
  }

  async save(diagram: {
    title: string;
    description: string;
    data: string;
    createdByUser: string;
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
    updateData: { title?: string; description?: string; data?: string },
  ) {
    const { data, error } = await this.supabase
      .getClient()
      .from('Diagrams')
      .update(updateData)
      .eq('id', id)
      .eq('createdByUser', userId)
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
      .eq('createdByUser', userId)
      .select()
      .single();

    if (error) {
      console.error('Error deleting diagram:', error);
      throw new Error(`Failed to delete diagram: ${error.message}`);
    }
    return data;
  }
}
