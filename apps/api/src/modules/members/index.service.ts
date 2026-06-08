import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { MembersRepository } from './index.repository';
import { UserRole } from '@prisma/client';

@Injectable()
export class MembersService {
  constructor(private readonly repository: MembersRepository) {}

  async getMembers(teamId: string, userId: string) {
    await this.verifyRole(teamId, userId, [UserRole.ADMIN, UserRole.MAINTAINER, UserRole.MEMBER]);

    try {
      const data = await this.repository.findMembersByTeam(teamId);
      // Map to maintain structure: .select('team_id, user_id, role, joined_at, Users(id, name, email)')
      return data.map(item => ({
        team_id: item.teamId,
        user_id: item.userId,
        role: item.role.toLowerCase(),
        joined_at: item.joinedAt,
        Users: item.user
      }));
    } catch (error) {
      throw new Error(`Failed to fetch members: ${error.message}`);
    }
  }

  async updateMemberRole(
    teamId: string,
    adminId: string,
    memberUserId: string,
    role: 'admin' | 'member' | 'maintainer',
  ): Promise<void> {
    await this.verifyRole(teamId, adminId, [UserRole.ADMIN]);

    try {
      await this.repository.updateRole(
        teamId, 
        memberUserId, 
        role.toUpperCase() as UserRole
      );
    } catch (error) {
      throw new Error(`Failed to update role: ${error.message}`);
    }
  }

  async updateMembersRoles(
    teamId: string,
    adminId: string,
    updates: { userId: string, role: 'admin' | 'member' | 'maintainer' }[],
  ): Promise<void> {
    await this.verifyRole(teamId, adminId, [UserRole.ADMIN]);

    try {
      await this.repository.updateMembersRoles(
        teamId,
        updates.map(u => ({ userId: u.userId, role: u.role.toUpperCase() as UserRole }))
      );
    } catch (error) {
      throw new Error(`Failed to update members roles: ${error.message}`);
    }
  }

  async removeMember(
    teamId: string,
    adminId: string,
    memberUserId: string,
  ): Promise<void> {
    await this.verifyRole(teamId, adminId, [UserRole.ADMIN]);

    try {
      await this.repository.removeMember(teamId, memberUserId);
    } catch (error) {
      throw new Error(`Failed to remove member: ${error.message}`);
    }
  }

  async removeMembers(
    teamId: string,
    adminId: string,
    userIds: string[],
  ): Promise<void> {
    await this.verifyRole(teamId, adminId, [UserRole.ADMIN]);

    try {
      await this.repository.removeMembers(teamId, userIds);
    } catch (error) {
      throw new Error(`Failed to remove members: ${error.message}`);
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
