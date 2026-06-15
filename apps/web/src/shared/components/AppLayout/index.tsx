import { Box } from "@primer/react";
import { Sidebar } from "../Sidebar";
import { useState } from "react";
import { AppLayoutProps } from "./index.types";

export function AppLayout({ children, currentPage, onNavigate, onLogout }: AppLayoutProps) {
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
          marginLeft: isExpanded ? '300px' : '64px',
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
