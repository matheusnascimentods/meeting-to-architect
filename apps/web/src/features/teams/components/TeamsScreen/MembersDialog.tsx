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

  const fetchMembers = async () => {
    try {
      const data = await memberService.getMembers(teamId);
      setMembers(data);
      setRoleChanges({}); // Clear changes on fresh fetch
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

  const handleSaveRoles = async () => {
    const updates = Object.entries(roleChanges).map(([userId, role]) => ({ userId, role }));
    if (updates.length === 0) return;

    setSaving(true);
    try {
      await memberService.updateMembersRoles(teamId, updates);
      success("Members roles updated successfully.");
      await fetchMembers();
    } catch (error) {
      toastError("Failed to update members roles.");
      console.error("Failed to update roles", error);
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveMember = async (memberUserId: string) => {
    if (!confirm("Are you sure you want to remove this member?")) return;
    try {
      await memberService.removeMember(teamId, memberUserId);
      success("Member removed successfully.");
      fetchMembers();
    } catch (error) {
      toastError("Failed to remove member.");
      console.error("Failed to remove member", error);
    }
  };

  const hasChanges = Object.keys(roleChanges).length > 0;

  return (
    <Dialog onClose={onClose} title={`Members of ${teamName}`} width="large">
      <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Text sx={{ color: 'fg.muted', fontSize: 1, mb: 2 }}>
          Manage your team members and their roles. Changes to roles will be applied after clicking 'Save Changes'.
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
                  const isChanged = !!roleChanges[member.user_id];
                  
                  return (
                    <Box as="tr" key={member.user_id} sx={{ 
                      borderBottom: '1px solid', 
                      borderColor: 'border.subtle',
                      bg: isChanged ? 'accent.subtle' : 'transparent',
                      '&:last-child': { borderBottom: 'none' }
                    }}>
                      <Box as="td" sx={{ p: 3 }}>
                        <Text sx={{ fontWeight: 'bold', display: 'block' }}>{member.Users?.name}</Text>
                        <Text sx={{ fontSize: 0, color: 'fg.muted' }}>{member.Users?.email}</Text>
                      </Box>
                      <Box as="td" sx={{ p: 3 }}>
                        <ActionMenu>
                          <ActionMenu.Button size="small" sx={{ textTransform: 'capitalize', minWidth: '100px', textAlign: 'left' }}>
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
                        {isChanged && <Text sx={{ fontSize: 0, ml: 2, color: 'accent.fg', fontStyle: 'italic' }}>(Pending)</Text>}
                      </Box>
                      <Box as="td" sx={{ p: 3, textAlign: 'right' }}>
                        <IconButton
                          icon={TrashIcon}
                          aria-label="Remove member"
                          variant="danger"
                          size="small"
                          onClick={() => handleRemoveMember(member.user_id)}
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
            onClick={handleSaveRoles} 
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
