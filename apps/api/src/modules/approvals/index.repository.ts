import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/index.service';
import { ApprovalStatus, UserRole } from '@prisma/client';

@Injectable()
export class ApprovalsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findPendingByTeam(teamId: string) {
    return this.prisma.approvalRequest.findMany({
      where: {
        teamId,
        status: ApprovalStatus.PENDING,
      },
      include: {
        diagram: {
          select: { title: true, type: true },
        },
        requester: {
          select: { name: true, email: true },
        },
      },
    });
  }

  async findPendingByDiagram(diagramId: string) {
    return this.prisma.approvalRequest.findMany({
      where: {
        diagramId,
        status: ApprovalStatus.PENDING,
      },
      select: {
        teamId: true,
      },
    });
  }

  async findAllByRequester(userId: string) {
    return this.prisma.approvalRequest.findMany({
      where: {
        requestedBy: userId,
      },
      include: {
        diagram: {
          select: { title: true, type: true },
        },
        team: {
          select: { name: true },
        },
      },
      orderBy: {
        requestedAt: 'desc',
      },
    });
  }

  async findById(id: string) {
    return this.prisma.approvalRequest.findUnique({
      where: { id },
    });
  }

  async updateStatus(id: string, status: ApprovalStatus, reviewedBy: string) {
    return this.prisma.approvalRequest.update({
      where: { id },
      data: {
        status,
        reviewedBy,
        reviewedAt: new Date(),
      },
    });
  }

  async updateDiagramTeam(diagramId: string, teamId: string) {
    return this.prisma.diagram.update({
      where: { id: diagramId },
      data: { teamId },
    });
  }

  async remove(id: string) {
    return this.prisma.approvalRequest.delete({
      where: { id },
    });
  }

  async getMemberRole(teamId: string, userId: string) {
    const member = await this.prisma.teamMember.findFirst({
      where: { teamId, userId },
      select: { role: true },
    });
    return member?.role;
  }
}
