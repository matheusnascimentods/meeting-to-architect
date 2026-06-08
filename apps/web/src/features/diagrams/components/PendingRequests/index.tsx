import { useState, useEffect } from "react";
import { Box, Text, CounterLabel } from "@primer/react";
import { LawIcon } from "@primer/octicons-react";
import { approvalService } from "../../services/approval.service";

export function PendingRequests({ 
  diagramId, 
  onClick 
}: { 
  diagramId?: string; 
  onCancel?: () => void;
  onClick?: () => void;
}) {
  const [requests, setRequests] = useState<any[]>([]);

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

  if (requests.length === 0) return null;

  const pendingCount = requests.filter(r => r.status.toUpperCase() === 'PENDING').length;

  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 3,
        mb: 4,
        border: '1px solid',
        borderColor: 'attention.emphasis',
        borderRadius: 2,
        bg: 'attention.subtle',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        "&:hover": {
          bg: 'attention.muted',
          transform: 'translateY(-1px)',
          boxShadow: 'shadow.small',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <LawIcon size={20} />
        <Text sx={{ fontWeight: 'bold', fontSize: 2 }}>My Requests</Text>
        <CounterLabel sx={{ bg: 'attention.emphasis', color: 'fg.onEmphasis' }}>
          {requests.length}
        </CounterLabel>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {pendingCount > 0 && (
            <Text sx={{ fontSize: 0, color: 'attention.fg' }}>
                {pendingCount} pending
            </Text>
        )}
        <Text sx={{ fontSize: 0, fontWeight: 'bold', color: 'attention.fg' }}>
            Review your diagram requests →
        </Text>
      </Box>
    </Box>
  );
}
