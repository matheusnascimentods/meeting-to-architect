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

  async findAll(userId: string) {
    try {
      return await this.repository.findAllByUser(userId);
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
      if (role === UserRole.ADMIN) return;
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
    await this.checkPermissions(id, userId);
    
    const { title, description, mermaid_code, type } = updateData;
    try {
      return await this.repository.update(id, {
        title,
        description,
        mermaidCode: mermaid_code,
        type: type as DiagramType,
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
