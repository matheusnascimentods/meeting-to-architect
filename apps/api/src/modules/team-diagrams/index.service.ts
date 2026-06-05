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

  async findByTeam(teamId: string, userId: string): Promise<any[]> {
    const member = await this.repository.findMember(teamId, userId);

    if (!member)
      throw new ForbiddenException('You are not a member of this team');

    try {
      return await this.repository.findByTeam(teamId);
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
        await this.repository.createApprovalRequest(diagramId, teamId, userId);
      }
    } catch (error) {
      console.error('Error adding diagram to team:', error);
      throw new Error(`Failed to add diagram to team: ${error.message || 'Unknown error'}`);
    }
  }
}
