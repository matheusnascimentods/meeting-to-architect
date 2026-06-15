import { api } from "@/shared/services";

class InviteService {
  async getMyInvites(): Promise<any[]> {
    const { data } = await api.get("/invites/me");
    return data;
  }

  async invite(teamId: string, email: string): Promise<void> {
    await api.post(`/invites/team/${teamId}`, { email });
  }

  async respondInvite(inviteId: string, accept: boolean): Promise<void> {
    await api.patch(`/invites/${inviteId}/respond`, { accept });
  }
}

export const inviteService = new InviteService();
