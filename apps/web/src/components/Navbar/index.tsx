import { Button, IconButton, ActionMenu, Box, Text, ActionList } from "@primer/react";
import { ArrowLeftIcon, PlusIcon, PersonIcon, SignOutIcon } from "@primer/octicons-react";
import "./styles.css";
import { User } from "../../lib/mockUsers";

interface NavbarProps {
  showBack?: boolean;
  onBack?: () => void;
  showNewButton?: boolean;
  onNewClick?: () => void;
  user?: User | null;
  onLogout?: () => void;
}

export function Navbar({ showBack, onBack, showNewButton, onNewClick, user, onLogout }: NavbarProps) {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        {showBack && (
          <IconButton
            icon={ArrowLeftIcon}
            aria-label="Back to list"
            variant="invisible"
            onClick={onBack}
          />
        )}
        <div className="navbar-brand">
          <span className="brand-name">M2A</span>
          <span className="brand-sub">Meeting to Architecture</span>
        </div>
      </div>
      <div className="navbar-right" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {showNewButton && (
          <Button variant="primary" leadingVisual={PlusIcon} onClick={onNewClick}>New Diagram</Button>
        )}
        
        {user && (
          <ActionMenu>
            <ActionMenu.Anchor>
              {/* Using a custom anchor for the avatar style */}
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  bg: 'accent.subtle',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <Text sx={{ color: 'accent.fg', fontWeight: 'bold', fontSize: 0 }}>
                  {user.name[0]}
                </Text>
              </Box>
            </ActionMenu.Anchor>

            <ActionMenu.Overlay align="end">
              <ActionList>
                <ActionList.Item onSelect={() => {}}>
                  <ActionList.LeadingVisual>
                    <PersonIcon />
                  </ActionList.LeadingVisual>
                  Profile
                </ActionList.Item>
                <ActionList.Divider />
                <ActionList.Item variant="danger" onSelect={onLogout}>
                  <ActionList.LeadingVisual>
                    <SignOutIcon />
                  </ActionList.LeadingVisual>
                  Sign out
                </ActionList.Item>
              </ActionList>
            </ActionMenu.Overlay>
          </ActionMenu>
        )}
      </div>
    </nav>
  );
}
