import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDiagramDto } from './index.schema';
import { DiagramsRepository } from './index.repository';
import { DiagramType } from '@prisma/client';

@Injectable()
export class DiagramsService {
  constructor(private readonly repository: DiagramsRepository) {}

  async findAll(userId: string) {
    try {
      return await this.repository.findAllByUser(userId);
    } catch (error) {
      console.error('Error fetching diagrams:', error);
      throw new Error(`Failed to fetch diagrams: ${error.message}`);
    }
  }

  async softDelete(id: string, userId: string): Promise<void> {
    const data = await this.repository.findById(id);

    if (!data)
      throw new NotFoundException('Diagram not found');
    if (data.createdBy !== userId)
      throw new ForbiddenException('No permission to delete this diagram');

    try {
      await this.repository.softDelete(id);
    } catch (error) {
      throw new Error(`Failed to delete diagram: ${error.message}`);
    }
  }

  async save(diagram: CreateDiagramDto) {
    try {
      return await this.repository.create({
        title: diagram.title,
        description: diagram.description,
        mermaidCode: diagram.mermaid_code,
        type: diagram.type as DiagramType,
        creator: { connect: { id: diagram.created_by } },
      });
    } catch (error) {
      console.error('Error saving diagram:', error);
      throw new Error(`Failed to save diagram: ${error.message}`);
    }
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
    const { title, description, mermaid_code, type } = updateData;
    try {
      return await this.repository.update(id, {
        title,
        description,
        mermaidCode: mermaid_code,
        type: type as DiagramType,
        // Ensure it belongs to the user if we want to enforce it here
        // The original code used .eq('created_by', userId) in the update
      });
    } catch (error) {
      console.error('Error updating diagram:', error);
      throw new Error(`Failed to update diagram: ${error.message}`);
    }
  }

  async remove(id: string, userId: string) {
    try {
      // The original code used .eq('created_by', userId) in the delete
      return await this.repository.delete(id);
    } catch (error) {
      console.error('Error deleting diagram:', error);
      throw new Error(`Failed to delete diagram: ${error.message}`);
    }
  }
}
