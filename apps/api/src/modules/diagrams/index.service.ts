import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDiagramDto } from './index.schema';
import { DiagramsRepository } from './index.repository';
import { TeamsRepository } from '../teams/index.repository';
import { DiagramType, UserRole } from '@prisma/client';

@Injectable()
export class DiagramsService {
  constructor(
    private readonly repository: DiagramsRepository,
    private readonly teamsRepository: TeamsRepository,
  ) {}

  private mapToFrontend(diagram: any) {
    if (!diagram) return null;
    return {
      id: diagram.id,
      title: diagram.title,
      description: diagram.description,
      type: diagram.type,
      mermaid_code: diagram.mermaidCode,
      created_by: diagram.createdBy,
      team_id: diagram.teamId,
      is_deleted: diagram.isDeleted,
      created_at: diagram.createdAt,
      updated_at: diagram.updatedAt,
      creator: diagram.creator,
    };
  }

  async findAll(userId: string) {
    try {
      const data = await this.repository.findAllByUser(userId);
      return data.map((d) => this.mapToFrontend(d));
    } catch (error) {
      console.error('Error fetching diagrams:', error);
      throw new Error(`Failed to fetch diagrams: ${error.message}`);
    }
  }

  private async checkPermissions(diagramId: string, userId: string) {
    const diagram = await this.repository.findById(diagramId);
    if (!diagram) throw new NotFoundException('Diagram not found');

    if (diagram.createdBy === userId) return;

    if (diagram.teamId) {
      const role = await this.teamsRepository.getMemberRole(diagram.teamId, userId);
      if (role === UserRole.ADMIN || role === UserRole.MAINTAINER) return;
    }

    throw new ForbiddenException('You do not have permission to modify this diagram');
  }

  async softDelete(id: string, userId: string): Promise<void> {
    await this.checkPermissions(id, userId);

    try {
      await this.repository.softDelete(id);
    } catch (error) {
      throw new Error(`Failed to delete diagram: ${error.message}`);
    }
  }

  async save(diagram: CreateDiagramDto) {
    try {
      const data = await this.repository.create({
        title: diagram.title,
        description: diagram.description,
        mermaidCode: diagram.mermaid_code,
        type: diagram.type as DiagramType,
        creator: { connect: { id: diagram.created_by } },
      });
      return this.mapToFrontend(data);
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
    await this.checkPermissions(id, userId);
    
    const { title, description, mermaid_code, type } = updateData;
    try {
      const data = await this.repository.update(id, {
        title,
        description,
        mermaidCode: mermaid_code,
        type: type as DiagramType,
      });
      return this.mapToFrontend(data);
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
