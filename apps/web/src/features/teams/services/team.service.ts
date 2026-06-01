import { api } from "@/shared/lib/api";
import { CreateTeamDto, UpdateTeamDto, UserTeam, Team } from "../types";

class TeamService {
  async findAll(): Promise<UserTeam[]> {
    const { data } = await api.get<UserTeam[]>("/teams");
    return data;
  }

  async findById(id: string): Promise<{ role: string; Teams: Team }> {
    const { data } = await api.get<{ role: string; Teams: Team }>(`/teams/${id}`);
    return data;
  }

  async create(dto: CreateTeamDto): Promise<Team> {
    const { data } = await api.post<Team>("/teams", dto);
    return data;
  }

  async update(id: string, dto: UpdateTeamDto): Promise<void> {
    await api.patch(`/teams/${id}`, dto);
  }

  async delete(id: string): Promise<void> {
    await api.delete(`/teams/${id}`);
  }

  async invite(teamId: string, email: string): Promise<void> {
    await api.post(`/teams/${teamId}/invite`, { email });
  }

  async getMyInvites(): Promise<any[]> {
    const { data } = await api.get("/teams/invites/me");
    return data;
  }

  async respondInvite(inviteId: string, accept: boolean): Promise<void> {
    await api.patch(`/teams/invites/${inviteId}/respond`, { accept });
  }
}

export const teamService = new TeamService();
