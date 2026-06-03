import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/index.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class MembersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMembersByTeam(teamId: string) {
    return this.prisma.teamMember.findMany({
      where: { teamId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async updateRole(teamId: string, userId: string, role: UserRole) {
    return this.prisma.teamMember.updateMany({
      where: { teamId, userId },
      data: { role },
    });
  }

  async removeMember(teamId: string, userId: string) {
    return this.prisma.teamMember.deleteMany({
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
}
