import { useState, useEffect } from "react";
import { Box, Button, Dialog, Text, ActionMenu, ActionList, IconButton } from "@primer/react";
import { KebabHorizontalIcon, TrashIcon } from "@primer/octicons-react";
import { memberService } from "../../services/member.service";
import { TeamMember } from "../../types";
import { LoadingState } from "@/shared/components/LoadingState";

interface Props {
  teamId: string;
  teamName: string;
  onClose: () => void;
}

export function MembersDialog({ teamId, teamName, onClose }: Props) {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    try {
      const data = await memberService.getMembers(teamId);
      setMembers(data);
    } catch (error) {
      console.error("Failed to fetch members", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [teamId]);

  const handleUpdateRole = async (memberUserId: string, role: string) => {
    try {
      await memberService.updateMemberRole(teamId, memberUserId, role);
      fetchMembers();
    } catch (error) {
      console.error("Failed to update role", error);
    }
  };

  const handleRemoveMember = async (memberUserId: string) => {
    if (!confirm("Are you sure you want to remove this member?")) return;
    try {
      await memberService.removeMember(teamId, memberUserId);
      fetchMembers();
    } catch (error) {
      console.error("Failed to remove member", error);
    }
  };

  return (
    <Dialog onClose={onClose} title={`Members of ${teamName}`} sx={{ width: '600px' }}>
      <Box sx={{ p: 3 }}>
        {loading ? (
          <LoadingState message="Loading members..." />
        ) : (
          <Box as="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <Box as="tr" sx={{ borderBottom: '1px solid', borderColor: 'border.default' }}>
                <Box as="th" sx={{ textAlign: 'left', p: 2 }}>Name</Box>
                <Box as="th" sx={{ textAlign: 'left', p: 2 }}>Role</Box>
                <Box as="th" sx={{ textAlign: 'right', p: 2 }}>Actions</Box>
              </Box>
            </thead>
            <tbody>
              {members.map((member) => (
                <Box as="tr" key={member.user_id} sx={{ borderBottom: '1px solid', borderColor: 'border.subtle' }}>
                  <Box as="td" sx={{ p: 2 }}>
                    <Text sx={{ fontWeight: 'bold' }}>{member.Users?.name}</Text>
                    <br />
                    <Text sx={{ fontSize: 0, color: 'fg.muted' }}>{member.Users?.email}</Text>
                  </Box>
                  <Box as="td" sx={{ p: 2 }}>
                    <ActionMenu>
                      <ActionMenu.Button size="small" sx={{ textTransform: 'capitalize' }}>
                        {member.role}
                      </ActionMenu.Button>
                      <ActionMenu.Overlay>
                        <ActionList>
                          <ActionList.Item onClick={() => handleUpdateRole(member.user_id, 'admin')}>Admin</ActionList.Item>
                          <ActionList.Item onClick={() => handleUpdateRole(member.user_id, 'maintainer')}>Maintainer</ActionList.Item>
                          <ActionList.Item onClick={() => handleUpdateRole(member.user_id, 'member')}>Member</ActionList.Item>
                        </ActionList>
                      </ActionMenu.Overlay>
                    </ActionMenu>
                  </Box>
                  <Box as="td" sx={{ p: 2, textAlign: 'right' }}>
                    <IconButton
                      icon={TrashIcon}
                      aria-label="Remove member"
                      variant="danger"
                      size="small"
                      onClick={() => handleRemoveMember(member.user_id)}
                    />
                  </Box>
                </Box>
              ))}
            </tbody>
          </Box>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
          <Button onClick={onClose}>Close</Button>
        </Box>
      </Box>
    </Dialog>
  );
}
