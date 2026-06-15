import { api } from "@/shared/services";
import { TeamMember } from "../../types";

class MemberService {
  async getMembers(teamId: string): Promise<TeamMember[]> {
    const { data } = await api.get<TeamMember[]>(`/members/team/${teamId}`);
    return data;
  }

  async updateMemberRole(teamId: string, userId: string, role: string): Promise<void> {
    await api.patch(`/members/team/${teamId}/user/${userId}/role`, { role });
  }

  async updateMembersRoles(teamId: string, updates: { userId: string, role: string }[]): Promise<void> {
    await api.patch(`/members/team/${teamId}/roles`, { updates });
  }

  async removeMember(teamId: string, userId: string): Promise<void> {
    await api.delete(`/members/team/${teamId}/user/${userId}`);
  }

  async removeMembers(teamId: string, userIds: string[]): Promise<void> {
    await api.delete(`/members/team/${teamId}/batch`, { data: { userIds } });
  }
}

export const memberService = new MemberService();
