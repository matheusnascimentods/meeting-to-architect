import { Box } from "@primer/react";
import { Sidebar } from "../Sidebar";
import { useState } from "react";

interface Props {
  children: React.ReactNode;
  currentPage: 'diagrams' | 'teams' | 'notifications' | 'trash';
  onNavigate: (page: 'diagrams' | 'teams' | 'notifications' | 'trash') => void;
  onLogout: () => void;
}

export function AppLayout({ children, currentPage, onNavigate, onLogout }: Props) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar
        currentPage={currentPage}
        onNavigate={onNavigate}
        onLogout={onLogout}
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded(!isExpanded)}
      />
      <Box
        sx={{
          flex: 1,
          marginLeft: isExpanded ? '240px' : '64px',
          transition: 'margin-left 0.2s ease',
          minHeight: '100vh',
          bg: 'canvas.default',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
