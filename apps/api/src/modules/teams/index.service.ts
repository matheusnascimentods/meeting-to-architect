import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateTeamDto, UpdateTeamDto } from './index.schema';
import { TeamsRepository } from './index.repository';
import { UserRole } from '@prisma/client';

@Injectable()
export class TeamsService {
  constructor(private readonly repository: TeamsRepository) {}

  async create(dto: CreateTeamDto, userId: string) {
    try {
      return await this.repository.create(dto.name, userId);
    } catch (error) {
      throw new Error(`Failed to create team: ${error.message}`);
    }
  }

  async findAllByUser(userId: string) {
    try {
      const data = await this.repository.findAllByUser(userId);

      // Map to maintain similar structure as before if needed, 
      // although the service was returning Team_Members results.
      // The original code was: .select('team_id, role, Teams (*)')
      return data.map(item => ({
        team_id: item.teamId,
        role: item.role.toLowerCase(),
        Teams: item.team
      }));
    } catch (error) {
      console.error('Error fetching teams:', error);
      throw new Error(`Failed to fetch teams: ${error.message}`);
    }
  }

  async findById(id: string, userId: string) {
    const data = await this.repository.findMemberByTeamAndUser(id, userId);

    if (!data)
      throw new NotFoundException('Team not found');
    
    return {
      role: data.role.toLowerCase(),
      Teams: data.team
    };
  }

  async update(id: string, userId: string, dto: UpdateTeamDto): Promise<void> {
    await this.verifyAdmin(id, userId);

    try {
      await this.repository.update(id, dto);
    } catch (error) {
      throw new Error(`Failed to update team: ${error.message}`);
    }
  }

  async delete(id: string, userId: string): Promise<void> {
    await this.verifyAdmin(id, userId);

    try {
      await this.repository.delete(id);
    } catch (error) {
      throw new Error(`Failed to delete team: ${error.message}`);
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

  private async verifyAdmin(teamId: string, userId: string): Promise<void> {
    return this.verifyRole(teamId, userId, [UserRole.ADMIN]);
  }
}
