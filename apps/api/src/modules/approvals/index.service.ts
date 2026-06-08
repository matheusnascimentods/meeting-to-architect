import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { ApprovalsRepository } from './index.repository';
import { ApprovalStatus, UserRole } from '@prisma/client';

@Injectable()
export class ApprovalsService {
  constructor(private readonly repository: ApprovalsRepository) {}

  async getTeamRequests(teamId: string, userId: string) {
    const role = await this.repository.getMemberRole(teamId, userId);

    if (!role)
      throw new ForbiddenException('You are not a member of this team');

    if (role !== UserRole.ADMIN && role !== UserRole.MAINTAINER) return [];

    try {
      const data = await this.repository.findPendingByTeam(teamId);
      // Map to maintain structure: Diagrams(title, type), Users!requested_by(name, email)
      return data.map(item => ({
        ...item,
        Diagrams: item.diagram,
        Users: item.requester
      }));
    } catch (error) {
      throw new Error(`Failed to fetch requests: ${error.message}`);
    }
  }

  async getPendingByDiagram(diagramId: string) {
    try {
      return await this.repository.findPendingByDiagram(diagramId);
    } catch (error) {
      throw new Error(`Failed to fetch pending requests for diagram: ${error.message}`);
    }
  }

  async respondRequest(
    requestId: string,
    adminId: string,
    approve: boolean,
  ): Promise<void> {
    const data = await this.repository.findById(requestId);

    if (!data)
      throw new NotFoundException('Request not found');

    await this.verifyRole(data.teamId, adminId, [UserRole.ADMIN, UserRole.MAINTAINER]);

    try {
      await this.repository.updateStatus(
        requestId,
        approve ? ApprovalStatus.ACCEPTED : ApprovalStatus.REJECTED,
        adminId
      );

      if (approve) {
        await this.repository.updateDiagramTeam(data.diagramId, data.teamId);
      }
    } catch (error) {
      throw new Error(`Failed to respond to request: ${error.message}`);
    }
  }

  private async verifyRole(
    teamId: string,
    userId: string,
    allowedRoles: UserRole[],
  ): Promise<void> {
    const role = await this.repository.getMemberRole(teamId, userId);

    if (!role)
      throw new NotFoundException('Team not found');
    if (!allowedRoles.includes(role))
      throw new ForbiddenException('You do not have permission for this action');
  }
}
