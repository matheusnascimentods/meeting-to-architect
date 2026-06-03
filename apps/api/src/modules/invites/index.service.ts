import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InvitesRepository } from './index.repository';
import { InviteStatus, UserRole } from '@prisma/client';

@Injectable()
export class InvitesService {
  constructor(private readonly repository: InvitesRepository) {}

  async inviteMember(
    teamId: string,
    invitedEmail: string,
    adminId: string,
  ): Promise<void> {
    await this.verifyAdmin(teamId, adminId);

    const user = await this.repository.findUserByEmail(invitedEmail);

    if (!user)
      throw new NotFoundException('User not found with this email');

    try {
      await this.repository.createInvite(teamId, adminId, user.id);
    } catch (error) {
      throw new Error(`Failed to invite member: ${error.message}`);
    }
  }

  async getMyInvites(userId: string) {
    try {
      const data = await this.repository.findInvitesByUser(userId);
      // Map to maintain structure if needed: .select('*, Teams(name)')
      return data.map(item => ({
        ...item,
        Teams: item.team
      }));
    } catch (error) {
      throw new Error(`Failed to fetch invites: ${error.message}`);
    }
  }

  async respondInvite(
    inviteId: string,
    userId: string,
    accept: boolean,
  ): Promise<void> {
    const data = await this.repository.findById(inviteId);

    if (!data || data.invitedUserId !== userId)
      throw new NotFoundException('Invite not found');

    try {
      await this.repository.updateStatus(
        inviteId,
        accept ? InviteStatus.ACCEPTED : InviteStatus.REJECTED,
      );

      if (accept) {
        const existing = await this.repository.findMember(data.teamId, userId);

        if (!existing) {
          await this.repository.addMember(data.teamId, userId, UserRole.MEMBER);
        }
      }
    } catch (error) {
      throw new Error(`Failed to respond to invite: ${error.message}`);
    }
  }

  private async verifyAdmin(teamId: string, userId: string): Promise<void> {
    const role = await this.repository.getMemberRole(teamId, userId);

    if (!role)
      throw new NotFoundException('Team not found');
    if (role !== UserRole.ADMIN)
      throw new ForbiddenException('You do not have permission for this action');
  }
}
