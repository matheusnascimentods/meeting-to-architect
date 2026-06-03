import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/index.service';
import { InviteStatus, UserRole } from '@prisma/client';

@Injectable()
export class InvitesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
  }

  async createInvite(teamId: string, invitedBy: string, invitedUserId: string) {
    return this.prisma.teamInvite.create({
      data: {
        teamId,
        invitedBy,
        invitedUserId,
        status: InviteStatus.PENDING,
      },
    });
  }

  async findInvitesByUser(userId: string) {
    return this.prisma.teamInvite.findMany({
      where: {
        invitedUserId: userId,
        status: InviteStatus.PENDING,
      },
      include: {
        team: {
          select: { name: true },
        },
      },
    });
  }

  async findById(id: string) {
    return this.prisma.teamInvite.findUnique({
      where: { id },
    });
  }

  async updateStatus(id: string, status: InviteStatus) {
    return this.prisma.teamInvite.update({
      where: { id },
      data: { status },
    });
  }

  async addMember(teamId: string, userId: string, role: UserRole) {
    return this.prisma.teamMember.create({
      data: {
        teamId,
        userId,
        role,
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
}
