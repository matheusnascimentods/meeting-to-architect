import { Box, CounterLabel, IconButton, NavList, Tooltip, Text } from "@primer/react";
import {
  SignOutIcon,
  SidebarCollapseIcon,
  SidebarExpandIcon,
  FileCodeIcon,
  PeopleIcon,
  TrashIcon,
} from "@primer/octicons-react";
import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/use-auth";

type SidebarPage = 'diagrams' | 'teams' | 'trash';

interface Props {
  currentPage: SidebarPage;
  onNavigate: (page: SidebarPage) => void;
  onLogout: () => void;
  isExpanded: boolean;
  onToggle: () => void;
}

const fontStack = "system-ui, -apple-system, BlinkMacSystemFont, sans-serif";

const navItems: { page: SidebarPage; label: string; icon: React.ElementType; counter?: number }[] = [
  { page: 'diagrams', label: 'My Diagrams', icon: FileCodeIcon },
  { page: 'teams', label: 'My Teams', icon: PeopleIcon },
  { page: 'trash', label: 'Trash', icon: TrashIcon },
];

export function Sidebar({ currentPage, onNavigate, onLogout, isExpanded, onToggle }: Props) {
  const { user } = useAuth();

  return (
    <Box
      sx={{
        width: isExpanded ? 300 : 64,
        transition: "width 0.2s ease",
        overflow: "hidden",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        borderRight: "1px solid",
        borderColor: "border.default",
        background: "canvas.subtle",
        display: "flex",
        flexDirection: "column",
        padding: isExpanded ? 3 : 2,
        fontFamily: fontStack,
        zIndex: 10,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: isExpanded ? "space-between" : "center",
          gap: 2,
          padding: isExpanded ? "4px 8px 16px" : "4px 0 16px",
          minHeight: 40,
        }}
      >
        {isExpanded ? (
          <Box sx={{ display: "flex", alignItems: "baseline", gap: 2, minWidth: 0 }}>
            <Text sx={{ fontSize: 4, fontWeight: 'bold', letterSpacing: "-0.02em" }}>M2A</Text>
            <Text sx={{ fontSize: 0, color: 'fg.muted', whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              Meeting to Architecture
            </Text>
          </Box>
        ) : (
          <Text sx={{ fontSize: 4, fontWeight: 'bold' }}>M</Text>
        )}

        {isExpanded && (
          <IconButton
            icon={SidebarCollapseIcon}
            aria-label="Collapse sidebar"
            variant="invisible"
            size="small"
            onClick={onToggle}
          />
        )}
      </Box>

      {!isExpanded && (
        <Box sx={{ display: "flex", justifyContent: "center", marginBottom: 2 }}>
          <IconButton
            icon={SidebarExpandIcon}
            aria-label="Expand sidebar"
            variant="invisible"
            size="small"
            onClick={onToggle}
          />
        </Box>
      )}

      <NavList>
        {navItems.map(({ page, label, icon: Icon, counter }) => (
          <NavList.Item
            key={page}
            aria-current={currentPage === page ? 'page' : undefined}
            onClick={(e) => {
              e.preventDefault();
              onNavigate(page);
            }}
            title={!isExpanded ? label : undefined}
          >
            <NavList.LeadingVisual>
              <Icon />
            </NavList.LeadingVisual>
            {isExpanded && label}
            {isExpanded && counter !== undefined && (
              <NavList.TrailingVisual>
                <CounterLabel>{counter}</CounterLabel>
              </NavList.TrailingVisual>
            )}
          </NavList.Item>
        ))}
      </NavList>

      <Box
        sx={{
          position: "absolute",
          left: isExpanded ? 3 : 2,
          right: isExpanded ? 3 : 2,
          bottom: 3,
          display: "flex",
          alignItems: "center",
          gap: 2,
          padding: isExpanded ? "10px 8px" : "10px 0",
          borderTop: "1px solid",
          borderColor: "border.default",
          paddingTop: 3,
          justifyContent: isExpanded ? "flex-start" : "center",
        }}
      >
        {isExpanded ? (
          <>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                bg: "accent.subtle",
                color: "accent.fg",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 'bold',
                fontSize: 1,
                flexShrink: 0,
              }}
            >
              {user?.name?.[0] || '?'}
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box
                sx={{
                  fontSize: 1,
                  fontWeight: 'bold',
                  color: "fg.default",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user?.name}
              </Box>
              <Box
                sx={{
                  fontSize: 0,
                  color: 'fg.muted',
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {user?.email}
              </Box>
            </Box>
            <IconButton
              icon={SignOutIcon}
              aria-label="Sign out"
              variant="invisible"
              size="small"
              onClick={onLogout}
            />
          </>
        ) : (
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              bg: "accent.subtle",
              color: "accent.fg",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 'bold',
              fontSize: 1,
              flexShrink: 0,
              cursor: "pointer",
            }}
            title={user?.name || 'User'}
          >
            {user?.name?.[0] || '?'}
          </Box>
        )}
      </Box>
    </Box>
  );
}
