import { Box, Text, Label, ActionMenu, ActionList, IconButton } from '@primer/react';
import { KebabHorizontalIcon, PencilIcon, TrashIcon, PeopleIcon } from '@primer/octicons-react';
import { UserTeam } from '../../types';
import { tokens } from '@/shared/styles/tokens';
import { formatRelativeTime } from '@/shared/lib/date-utils';

interface Props {
  userTeam: UserTeam;
  onClick: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onMembers?: () => void;
}

export function TeamItem({ userTeam, onClick, onEdit, onDelete, onMembers }: Props) {
  const team = userTeam.Teams || userTeam.teams;
  if (!team) return null;

  const isAdmin = userTeam.role === 'admin';
  const createdAt = (team as any).created_at || (team as any).createdAt;

  return (
    <Box
      sx={{
        p: 4,
        borderRadius: 2,
        border: "1px solid",
        borderColor: "border.default",
        bg: "canvas.default",
        display: "flex",
        flexDirection: "column",
        gap: 3,
        transition: "all 0.2s ease",
        position: 'relative',
        "&:hover": {
          borderColor: "accent.emphasis",
          boxShadow: "shadow.medium",
          transform: "translateY(-2px)",
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box 
          onClick={onClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onClick();
            }
          }}
          sx={{ cursor: 'pointer', flex: 1 }}
        >
          <Text sx={{ fontWeight: "bold", fontSize: 2, color: 'fg.default' }}>
            {team.name}
          </Text>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Label variant={userTeam.role === 'admin' ? 'accent' : 'secondary'} sx={{ textTransform: 'capitalize' }}>
            {userTeam.role}
          </Label>
          
          {isAdmin && (
            <ActionMenu>
              <ActionMenu.Anchor>
                <IconButton
                  icon={KebabHorizontalIcon}
                  aria-label="Team actions"
                  variant="invisible"
                  size="small"
                />
              </ActionMenu.Anchor>

              <ActionMenu.Overlay>
                <ActionList>
                  <ActionList.Item onClick={onEdit}>
                    <ActionList.LeadingVisual>
                      <PencilIcon />
                    </ActionList.LeadingVisual>
                    Edit
                  </ActionList.Item>
                  <ActionList.Item onClick={onMembers}>
                    <ActionList.LeadingVisual>
                      <PeopleIcon />
                    </ActionList.LeadingVisual>
                    Members
                  </ActionList.Item>
                  <ActionList.Divider />
                  <ActionList.Item variant="danger" onClick={onDelete}>
                    <ActionList.LeadingVisual>
                      <TrashIcon />
                    </ActionList.LeadingVisual>
                    Delete
                  </ActionList.Item>
                </ActionList>
              </ActionMenu.Overlay>
            </ActionMenu>
          )}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Text
          sx={{
            fontSize: 0,
            color: "fg.muted",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            lineHeight: 1.5,
            minHeight: "3em",
          }}
        >
          {team.description || "No description provided."}
        </Text>
      </Box>

      <Box sx={{ mt: 'auto', pt: 2, borderTop: '1px solid', borderColor: 'border.subtle' }}>
        <Text sx={{ fontSize: 0, color: 'fg.subtle' }}>
          {createdAt ? formatRelativeTime(createdAt) : 'Just now'}
        </Text>
      </Box>
    </Box>
  );
}
