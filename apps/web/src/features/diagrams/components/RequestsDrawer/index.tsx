import { useState, useEffect } from "react";
import { Box, Text, IconButton, Label, NavList, SideNav, ActionList, Button } from "@primer/react";
import { XIcon, ClockIcon, CheckCircleIcon, XCircleIcon, TrashIcon } from "@primer/octicons-react";
import { approvalService } from "../../services/approval.service";
import { useToast } from "@/shared/hooks/use-toast";
import { formatRelativeTime } from "@/shared/lib/date-utils";

interface RequestsDrawerProps {
  onClose: () => void;
}

export function RequestsDrawer({ onClose }: RequestsDrawerProps) {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { success, error: toastError } = useToast();

  const fetchRequests = async () => {
    try {
      const data = await approvalService.getMyRequests();
      setRequests(data);
    } catch (err) {
      console.error("Failed to fetch requests", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleCancel = async (id: string) => {
    try {
      await approvalService.cancelRequest(id);
      setRequests((prev) => prev.filter((r) => r.id !== id));
      success("Request cancelled successfully.");
    } catch (err) {
      toastError("Failed to cancel request.");
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status.toUpperCase()) {
      case "ACCEPTED":
        return <Label variant="success">Approved</Label>;
      case "REJECTED":
        return <Label variant="danger">Denied</Label>;
      case "PENDING":
        return <Label variant="attention">Pending</Label>;
      default:
        return <Label>{status}</Label>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case "ACCEPTED":
        return <Box sx={{ color: 'success.fg', display: 'inline-flex' }}><CheckCircleIcon size={20} /></Box>;
      case "REJECTED":
        return <Box sx={{ color: 'danger.fg', display: 'inline-flex' }}><XCircleIcon size={20} /></Box>;
      case "PENDING":
        return <Box sx={{ color: 'attention.fg', display: 'inline-flex' }}><ClockIcon size={20} /></Box>;
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        width: ["100%", "400px"],
        bg: "canvas.default",
        boxShadow: "shadow.large",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        borderLeft: "1px solid",
        borderColor: "border.default",
      }}
    >
      <Box
        sx={{
          p: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid",
          borderColor: "border.default",
        }}
      >
        <Text sx={{ fontWeight: "bold", fontSize: 2 }}>Request History</Text>
        <IconButton
          icon={XIcon}
          aria-label="Close"
          variant="invisible"
          onClick={onClose}
        />
      </Box>

      <Box sx={{ flex: 1, overflowY: "auto", p: 3 }}>
        {loading ? (
          <Text sx={{ color: "fg.muted" }}>Loading requests...</Text>
        ) : requests.length === 0 ? (
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Text sx={{ color: "fg.muted" }}>No requests found.</Text>
          </Box>
        ) : (
          <ActionList>
            {requests.map((request) => (
              <ActionList.Item 
                key={request.id} 
                sx={{ 
                  cursor: 'default',
                  '&:hover': { bg: 'transparent' } 
                }}
              >
                <ActionList.LeadingVisual>
                  {getStatusIcon(request.status)}
                </ActionList.LeadingVisual>
                <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Text sx={{ fontWeight: 'bold' }}>{request.Diagrams?.title}</Text>
                    {getStatusLabel(request.status)}
                  </Box>
                  <Text sx={{ fontSize: 0, color: 'fg.muted', mt: 1 }}>
                    Team: <strong>{request.Teams?.name}</strong>
                  </Text>
                  <Text sx={{ fontSize: 0, color: 'fg.subtle', mt: 1 }}>
                    {formatRelativeTime(request.requestedAt || request.requested_at)}
                  </Text>
                  
                  {request.status.toUpperCase() === "PENDING" && (
                    <Button 
                      size="small" 
                      variant="danger" 
                      leadingVisual={TrashIcon}
                      onClick={() => handleCancel(request.id)}
                      sx={{ mt: 2, alignSelf: 'flex-start' }}
                    >
                      Cancel Request
                    </Button>
                  )}
                </Box>
              </ActionList.Item>
            ))}
          </ActionList>
        )}
      </Box>
    </Box>
  );
}
