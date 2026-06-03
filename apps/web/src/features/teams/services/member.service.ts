import { api } from "@/shared/lib/api";
import { TeamMember } from "../types";

class MemberService {
  async getMembers(teamId: string): Promise<TeamMember[]> {
    const { data } = await api.get<TeamMember[]>(`/members/team/${teamId}`);
    return data;
  }

  async updateMemberRole(teamId: string, userId: string, role: string): Promise<void> {
    await api.patch(`/members/team/${teamId}/user/${userId}/role`, { role });
  }

  async removeMember(teamId: string, userId: string): Promise<void> {
    await api.delete(`/members/team/${teamId}/user/${userId}`);
  }
}

export const memberService = new MemberService();
