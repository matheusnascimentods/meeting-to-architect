import { useState, useEffect } from "react";
import { Box, Text, IconButton } from "@primer/react";
import { XIcon, ClockIcon } from "@primer/octicons-react";
import { approvalService } from "../../services/approval.service";
import { useToast } from "@/shared/hooks/use-toast";

export function PendingRequests({ diagramId, onCancel }: { diagramId?: string; onCancel?: () => void }) {
  const [requests, setRequests] = useState<any[]>([]);
  const { success, error: toastError } = useToast();

  const fetchRequests = async () => {
    try {
      let data = await approvalService.getMyRequests();
      if (diagramId) {
        data = data.filter((r) => r.diagramId === diagramId);
      }
      setRequests(data);
    } catch (err) {
      console.error("Failed to fetch pending requests", err);
    }
  };

  useEffect(() => {
    fetchRequests();
    
    // Refresh every minute to keep it updated
    const interval = setInterval(fetchRequests, 60000);
    return () => clearInterval(interval);
  }, [diagramId]);

  const handleCancel = async (id: string) => {
    try {
      await approvalService.cancelRequest(id);
      setRequests((prev) => prev.filter((r) => r.id !== id));
      success("Request cancelled successfully.");
      onCancel?.();
    } catch (err) {
      toastError("Failed to cancel request.");
    }
  };

  if (requests.length === 0) return null;

  return (
    <Box sx={{ mb: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
      {requests.map((request) => (
        <Box
          key={request.id}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 3,
            bg: "attention.subtle",
            border: "1px solid",
            borderColor: "attention.muted",
            borderRadius: 2,
            color: "attention.fg"
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <ClockIcon size={20} />
            <Box>
              <Text sx={{ fontWeight: 'bold', display: 'block' }}>
                Pending Approval: {request.Diagrams?.title}
              </Text>
              <Text sx={{ fontSize: 0 }}>
                Waiting for team <strong>{request.Teams?.name}</strong> to accept this diagram.
              </Text>
            </Box>
          </Box>
          <IconButton
            icon={XIcon}
            aria-label="Cancel request"
            variant="invisible"
            onClick={(e) => {
                e.stopPropagation();
                handleCancel(request.id);
            }}
            sx={{ color: "attention.fg" }}
          />
        </Box>
      ))}
    </Box>
  );
}
