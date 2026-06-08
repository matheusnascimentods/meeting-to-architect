import { useState, useEffect } from "react";
import { ActionMenu, ActionList, IconButton, Label, Dialog, Box, Select, Text } from "@primer/react";
import { KebabHorizontalIcon, PencilIcon, TrashIcon, PeopleIcon, CheckIcon, ClockIcon } from "@primer/octicons-react";
import { Diagram } from "../../types";
import { UserTeam } from "@/features/teams/types";
import { EditDiagramDialog } from "../EditDiagramDialog";
import { DeleteDiagramDialog } from "@/shared/components/DeleteDiagramDialog";
import { diagramService } from "../../services/diagram.service";
import { teamService } from "@/features/teams/services/team.service";
import { teamDiagramService } from "../../services/team-diagram.service";
import { approvalService } from "../../services/approval.service";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { COPY } from "@/shared/constants/copy";
import { formatRelativeTime } from "@/shared/lib/date-utils";
import "./styles.css";

import { useToast } from "@/shared/hooks/use-toast";

interface DiagramCardProps {
  diagram: Diagram;
  onOpen: () => void;
  onUpdate?: (updated: Diagram) => void;
  onDelete?: (id: string) => void;
  userTeams?: UserTeam[];
  refreshKey?: number;
}

export function DiagramCard({ diagram, onOpen, onUpdate, onDelete, userTeams: propUserTeams, refreshKey }: DiagramCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [showAddToTeam, setShowAddToTeam] = useState(false);
  const [userTeams, setUserTeams] = useState<UserTeam[]>(propUserTeams || []);
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [isAddingToTeam, setIsAddingToTeam] = useState(false);
  const [pendingTeamIds, setPendingTeamIds] = useState<string[]>([]);
  const { success, error: toastError } = useToast();
  const { user } = useAuth();

  const { title, description } = diagram;
  const type = diagram.type || "Diagram";
  const variant = diagram.variant || "accent";
  const date = diagram.created_at ? formatRelativeTime(diagram.created_at) : "Just now";

  const isCreator = user?.id === diagram.created_by;
  const teamMembership = userTeams.find(t => t.team_id === diagram.team_id);
  const canEdit = isCreator || teamMembership?.role === 'admin' || teamMembership?.role === 'maintainer';

  useEffect(() => {
    if (propUserTeams) {
      setUserTeams(propUserTeams);
    }
  }, [propUserTeams]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchTeams = !propUserTeams ? teamService.findAll() : Promise.resolve(propUserTeams);
        const [teams, pending] = await Promise.all([
          fetchTeams,
          approvalService.getPendingByDiagram(diagram.id)
        ]);
        setUserTeams(teams);
        setPendingTeamIds(pending.map(p => p.teamId));
      } catch (err) {
        console.error('Failed to load teams or pending requests');
      }
    };

    fetchData();
  }, [diagram.id, propUserTeams, refreshKey]);

  const handleDelete = async () => {
    try {
      await diagramService.deleteDiagram(diagram.id);
      onDelete?.(diagram.id);
      setIsDeleteDialogOpen(false);
    } catch (err) {
      // Re-throw to be handled by the dialog component if needed
      throw err;
    }
  };

  const handleAddToTeam = async () => {
    if (!selectedTeamId || isAddingToTeam) return;
    setIsAddingToTeam(true);
    try {
      const team = userTeams.find(t => t.team_id === selectedTeamId);
      await teamDiagramService.addToTeam(diagram.id, selectedTeamId);
      success(team?.role === 'admin'
        ? 'Diagram successfully added to the team.'
        : 'Request sent. Wait for admin approval.'
      );
      setShowAddToTeam(false);
    } catch (err) {
      toastError('Failed to add to the team.');
    } finally {
      setIsAddingToTeam(false);
    }
  };

  const availableTeams = userTeams.filter(ut => 
    ut.team_id !== diagram.team_id && !pendingTeamIds.includes(ut.team_id)
  );

  return (
    <>
      <div
        className="m2a-card diagram-card"
        onClick={onOpen}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onOpen();
          }
        }}
      >
        <div>
          <Label variant={variant}>{type}</Label>
        </div>
        <div>
          <div className="diagram-card-title">
            {title}
          </div>
          <div className="m2a-clamp diagram-card-description">
            {description}
          </div>
          {pendingTeamIds.length > 0 && (
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1, color: 'attention.fg' }}>
              <ClockIcon size={14} />
              <Text sx={{ fontSize: 0, fontWeight: 'bold' }}>Pending approval</Text>
            </Box>
          )}
        </div>
        <div className="diagram-card-divider" />
        <div className="diagram-card-footer">
          <span className="diagram-card-date">{date}</span>
          <span onClick={(e) => e.stopPropagation()}>
            {((!diagram.team_id && availableTeams.length > 0) || canEdit) && (
              <ActionMenu>
                <ActionMenu.Anchor>
                  <IconButton icon={KebabHorizontalIcon} aria-label="Options" variant="invisible" size="small" />
                </ActionMenu.Anchor>
                <ActionMenu.Overlay>
                  <ActionList>
                    {canEdit && (
                      <ActionList.Item onSelect={() => setIsEditDialogOpen(true)}>
                        <ActionList.LeadingVisual>
                          <PencilIcon />
                        </ActionList.LeadingVisual>
                        Edit
                      </ActionList.Item>
                    )}
                    {!diagram.team_id && pendingTeamIds.length === 0 && availableTeams.length > 0 && (
                    <ActionList.Item onSelect={() => setShowAddToTeam(true)}>
                      <ActionList.LeadingVisual>
                        <PeopleIcon />
                      </ActionList.LeadingVisual>
                      Add to Team
                    </ActionList.Item>
                    )}

                    {canEdit && (
                      <ActionList.Item variant="danger" onSelect={() => setIsDeleteDialogOpen(true)}>
                        <ActionList.LeadingVisual>
                          <TrashIcon />
                        </ActionList.LeadingVisual>
                        Delete
                      </ActionList.Item>
                    )}
                  </ActionList>
                </ActionMenu.Overlay>
              </ActionMenu>
            )}
          </span>
        </div>
      </div>
      {isEditDialogOpen && (
        <EditDiagramDialog
          diagram={diagram}
          onClose={() => setIsEditDialogOpen(false)}
          onSave={async (updated) => {
            try {
              const data = await diagramService.update(diagram.id, updated);
              onUpdate?.(data);
              success('Diagram updated successfully.');
              setIsEditDialogOpen(false);
            } catch (err) {
              toastError('Failed to update diagram.');
            }
          }}
        />
      )}
      {isDeleteDialogOpen && (
        <DeleteDiagramDialog
          diagram={diagram}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={handleDelete}
        />
      )}

      {showAddToTeam && (
        <Dialog
          title="Add to Team"
          width="medium"
          onClose={() => setShowAddToTeam(false)}
          footerButtons={[
            { buttonType: 'default', content: COPY.common.cancel, onClick: () => setShowAddToTeam(false) },
            {
              buttonType: 'primary',
              content: isAddingToTeam ? 'Adding...' : 'Add to Team',
              onClick: handleAddToTeam,
              disabled: !selectedTeamId || isAddingToTeam
            }
          ]}
        >
          <Box sx={{ p: 3 }}>
            <Text sx={{ display: 'block', mb: 3, color: 'fg.muted', fontSize: 1 }}>
              Choose a team to share this diagram with. If you are an admin, it will be added immediately. Otherwise, a request will be sent to the team admins.
            </Text>
            
            <Box sx={{ 
              border: '1px solid', 
              borderColor: 'border.default', 
              borderRadius: 2,
              maxHeight: '300px',
              overflowY: 'auto'
            }}>
              <ActionList selectionVariant="single">
                {availableTeams.length === 0 ? (
                  <ActionList.Item disabled>
                    <ActionList.LeadingVisual>
                      <PeopleIcon />
                    </ActionList.LeadingVisual>
                    No other teams available
                  </ActionList.Item>
                ) : (
                  availableTeams.map(ut => {
                    const team = ut.Teams || ut.teams;
                    const isSelected = selectedTeamId === ut.team_id;
                    return (
                      <ActionList.Item 
                        key={ut.team_id} 
                        selected={isSelected}
                        onSelect={() => setSelectedTeamId(ut.team_id)}
                      >
                        <ActionList.LeadingVisual>
                          <PeopleIcon />
                        </ActionList.LeadingVisual>
                        {team?.name}
                        <ActionList.Description variant="inline">
                          {ut.role.charAt(0).toUpperCase() + ut.role.slice(1)}
                        </ActionList.Description>
                        {isSelected && <ActionList.TrailingVisual><CheckIcon /></ActionList.TrailingVisual>}
                      </ActionList.Item>
                    );
                  })
                )}
              </ActionList>
            </Box>
          </Box>
        </Dialog>
      )}
    </>
  );
}
