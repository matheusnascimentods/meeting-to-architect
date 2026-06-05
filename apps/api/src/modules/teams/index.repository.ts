import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/index.service';
import { Prisma, UserRole } from '@prisma/client';

@Injectable()
export class TeamsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(name: string, userId: string) {
    return this.prisma.team.create({
      data: {
        name,
        members: {
          create: {
            userId,
            role: UserRole.ADMIN,
          },
        },
      },
    });
  }

  async findAllByUser(userId: string) {
    return this.prisma.teamMember.findMany({
      where: { userId },
      include: { team: true },
    });
  }

  async findMemberByTeamAndUser(teamId: string, userId: string) {
    return this.prisma.teamMember.findFirst({
      where: { teamId, userId },
      include: { team: true },
    });
  }

  async update(id: string, data: Prisma.TeamUpdateInput) {
    return this.prisma.team.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Clear teamId from all Diagrams associated with this team
      await tx.diagram.updateMany({
        where: { teamId: id },
        data: { teamId: null },
      });

      // 2. Delete all TeamMember records for this team
      await tx.teamMember.deleteMany({
        where: { teamId: id },
      });

      // 3. Delete all TeamInvite records for this team
      await tx.teamInvite.deleteMany({
        where: { teamId: id },
      });

      // 4. Delete all ApprovalRequest records for this team
      await tx.approvalRequest.deleteMany({
        where: { teamId: id },
      });

      // 5. Finally, delete the Team
      return tx.team.delete({
        where: { id },
      });
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
