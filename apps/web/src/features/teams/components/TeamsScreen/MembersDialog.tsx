import { useState, useEffect } from "react";
import { Box, Button, Dialog, Text, ActionMenu, ActionList, IconButton, Spinner } from "@primer/react";
import { TrashIcon, CheckIcon } from "@primer/octicons-react";
import { memberService } from "../../services/member.service";
import { TeamMember } from "../../types";
import { LoadingState } from "@/shared/components/LoadingState";
import { useToast } from "@/shared/hooks/use-toast";

interface Props {
  teamId: string;
  teamName: string;
  onClose: () => void;
}

export function MembersDialog({ teamId, teamName, onClose }: Props) {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { success, error: toastError } = useToast();
  
  // Track local role changes before saving
  const [roleChanges, setRoleChanges] = useState<Record<string, 'admin' | 'member' | 'maintainer'>>({});
  const [membersToRemove, setMembersToRemove] = useState<string[]>([]);

  const fetchMembers = async () => {
    try {
      const data = await memberService.getMembers(teamId);
      setMembers(data);
      setRoleChanges({}); // Clear changes on fresh fetch
      setMembersToRemove([]);
    } catch (error) {
      console.error("Failed to fetch members", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [teamId]);

  const handleRoleChange = (userId: string, role: 'admin' | 'member' | 'maintainer') => {
    setRoleChanges(prev => ({ ...prev, [userId]: role }));
  };

  const toggleRemoveMember = (userId: string) => {
    setMembersToRemove(prev => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleSaveChanges = async () => {
    const roleUpdates = Object.entries(roleChanges)
      .filter(([userId]) => !membersToRemove.includes(userId))
      .map(([userId, role]) => ({ userId, role }));

    setSaving(true);
    try {
      if (roleUpdates.length > 0) {
        await memberService.updateMembersRoles(teamId, roleUpdates);
      }
      
      if (membersToRemove.length > 0) {
        await memberService.removeMembers(teamId, membersToRemove);
      }

      success("Changes saved successfully.");
      await fetchMembers();
    } catch (error) {
      toastError("Failed to save changes.");
      console.error("Failed to save changes", error);
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = Object.keys(roleChanges).length > 0 || membersToRemove.length > 0;

  return (
    <Dialog onClose={onClose} title={`Members of ${teamName}`} width="550px">
      <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Text sx={{ color: 'fg.muted', fontSize: 1, mb: 2 }}>
          Manage your team members and their roles. Changes will be applied after clicking 'Save Changes'.
        </Text>

        {loading ? (
          <LoadingState message="Loading members..." />
        ) : (
          <Box sx={{ border: '1px solid', borderColor: 'border.default', borderRadius: 2, overflow: 'hidden' }}>
            <Box as="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
              <Box as="thead" sx={{ bg: 'canvas.subtle' }}>
                <Box as="tr" sx={{ borderBottom: '1px solid', borderColor: 'border.default' }}>
                  <Box as="th" sx={{ textAlign: 'left', p: 3, fontSize: 1 }}>Name</Box>
                  <Box as="th" sx={{ textAlign: 'left', p: 3, fontSize: 1 }}>Role</Box>
                  <Box as="th" sx={{ textAlign: 'right', p: 3, fontSize: 1 }}>Actions</Box>
                </Box>
              </Box>
              <tbody>
                {members.map((member) => {
                  const currentRole = roleChanges[member.user_id] || member.role;
                  const isRoleChanged = !!roleChanges[member.user_id];
                  const isMarkedForRemoval = membersToRemove.includes(member.user_id);
                  
                  return (
                    <Box as="tr" key={member.user_id} sx={{ 
                      borderBottom: '1px solid', 
                      borderColor: 'border.subtle',
                      bg: isMarkedForRemoval ? 'danger.subtle' : (isRoleChanged ? 'accent.subtle' : 'transparent'),
                      opacity: isMarkedForRemoval ? 0.6 : 1,
                      '&:last-child': { borderBottom: 'none' },
                      transition: 'all 0.2s ease'
                    }}>
                      <Box as="td" sx={{ p: 3 }}>
                        <Text sx={{ 
                          fontWeight: 'bold', 
                          display: 'block',
                          textDecoration: isMarkedForRemoval ? 'line-through' : 'none'
                        }}>
                          {member.Users?.name}
                        </Text>
                        <Text sx={{ fontSize: 0, color: 'fg.muted' }}>{member.Users?.email}</Text>
                      </Box>
                      <Box as="td" sx={{ p: 3 }}>
                        <ActionMenu>
                          <ActionMenu.Button 
                            size="small" 
                            disabled={isMarkedForRemoval}
                            sx={{ textTransform: 'capitalize', minWidth: '100px', textAlign: 'left' }}
                          >
                            {currentRole}
                          </ActionMenu.Button>
                          <ActionMenu.Overlay>
                            <ActionList selectionVariant="single">
                              <ActionList.Item selected={currentRole === 'admin'} onSelect={() => handleRoleChange(member.user_id, 'admin')}>Admin</ActionList.Item>
                              <ActionList.Item selected={currentRole === 'maintainer'} onSelect={() => handleRoleChange(member.user_id, 'maintainer')}>Maintainer</ActionList.Item>
                              <ActionList.Item selected={currentRole === 'member'} onSelect={() => handleRoleChange(member.user_id, 'member')}>Member</ActionList.Item>
                            </ActionList>
                          </ActionMenu.Overlay>
                        </ActionMenu>
                        {isRoleChanged && !isMarkedForRemoval && (
                          <Text sx={{ fontSize: 0, ml: 2, color: 'accent.fg', fontStyle: 'italic' }}>(Role change)</Text>
                        )}
                        {isMarkedForRemoval && (
                          <Text sx={{ fontSize: 0, ml: 2, color: 'danger.fg', fontWeight: 'bold' }}>(To be removed)</Text>
                        )}
                      </Box>
                      <Box as="td" sx={{ p: 3, textAlign: 'right' }}>
                        <IconButton
                          icon={TrashIcon}
                          aria-label={isMarkedForRemoval ? "Undo removal" : "Remove member"}
                          variant={isMarkedForRemoval ? "default" : "danger"}
                          size="small"
                          onClick={() => toggleRemoveMember(member.user_id)}
                          sx={isMarkedForRemoval ? { bg: 'canvas.default' } : {}}
                        />
                      </Box>
                    </Box>
                  );
                })}
              </tbody>
            </Box>
          </Box>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
          <Button onClick={onClose} disabled={saving}>Close</Button>
          <Button 
            variant="primary" 
            onClick={handleSaveChanges} 
            disabled={!hasChanges || saving}
            leadingVisual={saving ? Spinner : CheckIcon}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
