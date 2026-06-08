import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/index.service';
import { ApprovalStatus, UserRole } from '@prisma/client';

@Injectable()
export class TeamDiagramsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByTeam(teamId: string) {
    return this.prisma.diagram.findMany({
      where: {
        teamId,
        isDeleted: false,
      },
      include: {
        creator: {
          select: { name: true }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findDiagram(id: string) {
    return this.prisma.diagram.findUnique({
      where: { id },
      include: {
        creator: {
          select: { name: true }
        }
      },
    });
  }

  async findMember(teamId: string, userId: string) {
    return this.prisma.teamMember.findFirst({
      where: { teamId, userId },
    });
  }

  async getMemberRole(teamId: string, userId: string) {
    const member = await this.prisma.teamMember.findFirst({
      where: { teamId, userId },
      select: { role: true },
    });
    return member?.role;
  }

  async updateDiagramTeam(diagramId: string, teamId: string) {
    return this.prisma.diagram.update({
      where: { id: diagramId },
      data: { teamId },
      include: {
        creator: {
          select: { name: true }
        }
      },
    });
  }

  async createApprovalRequest(diagramId: string, teamId: string, requestedBy: string) {
    return this.prisma.approvalRequest.create({
      data: {
        diagramId,
        teamId,
        requestedBy,
        status: ApprovalStatus.PENDING,
      },
    });
  }

  async findPendingByDiagram(diagramId: string) {
    return this.prisma.approvalRequest.findMany({
      where: {
        diagramId,
        status: ApprovalStatus.PENDING,
      },
    });
  }
}
