import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TeamDiagramsRepository } from './index.repository';
import { UserRole } from '@prisma/client';

@Injectable()
export class TeamDiagramsService {
  constructor(private readonly repository: TeamDiagramsRepository) {}

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

  async findByTeam(teamId: string, userId: string): Promise<any[]> {
    const member = await this.repository.findMember(teamId, userId);

    if (!member)
      throw new ForbiddenException('You are not a member of this team');

    try {
      const data = await this.repository.findByTeam(teamId);
      return data.map((d) => this.mapToFrontend(d));
    } catch (error) {
      throw new Error(`Failed to fetch team diagrams: ${error.message}`);
    }
  }

  async addToTeam(
    diagramId: string,
    teamId: string,
    userId: string,
  ): Promise<void> {
    const diagram = await this.repository.findDiagram(diagramId);
    if (!diagram) throw new NotFoundException('Diagram not found');

    const role = await this.repository.getMemberRole(teamId, userId);

    if (!role)
      throw new ForbiddenException('You are not a member of this team');

    try {
      if (role === UserRole.ADMIN) {
        await this.repository.updateDiagramTeam(diagramId, teamId);
      } else {
        // Check if there is already any pending request for this diagram
        const pendingRequests = await this.repository.findPendingByDiagram(diagramId);
        if (pendingRequests.length > 0) {
          throw new ForbiddenException('This diagram already has a pending approval request');
        }
        await this.repository.createApprovalRequest(diagramId, teamId, userId);
      }
    } catch (error) {
      if (error instanceof ForbiddenException) throw error;
      console.error('Error adding diagram to team:', error);
      throw new Error(`Failed to add diagram to team: ${error.message || 'Unknown error'}`);
    }
  }
}
