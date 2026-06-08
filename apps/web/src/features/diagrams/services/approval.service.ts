import { api } from "@/shared/lib/api";

class ApprovalService {
  async getTeamRequests(teamId: string): Promise<any[]> {
    const { data } = await api.get(`/approvals/team/${teamId}`);
    return data;
  }

  async getPendingByDiagram(diagramId: string): Promise<{ teamId: string }[]> {
    const { data } = await api.get(`/approvals/diagram/${diagramId}`);
    return data;
  }

  async getMyRequests(): Promise<any[]> {
    const { data } = await api.get('/approvals/my-requests');
    return data;
  }

  async cancelRequest(requestId: string): Promise<void> {
    await api.delete(`/approvals/${requestId}/cancel`);
  }

  async respondRequest(requestId: string, approve: boolean): Promise<void> {
    await api.patch(`/approvals/${requestId}/respond`, { approve });
  }
}

export const approvalService = new ApprovalService();
