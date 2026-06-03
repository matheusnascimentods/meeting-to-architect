import { useState, useEffect } from "react";
import { ActionMenu, ActionList, IconButton, Label, Dialog, Box, Select, Flash, Text } from "@primer/react";
import { KebabHorizontalIcon, PencilIcon, TrashIcon, PeopleIcon } from "@primer/octicons-react";
import { Diagram } from "../../types";
import { UserTeam } from "@/features/teams/types";
import { EditDiagramDialog } from "../EditDiagramDialog";
import { DeleteDiagramDialog } from "@/shared/components/DeleteDiagramDialog";
import { diagramService } from "../../services/diagram.service";
import { teamService } from "@/features/teams/services/team.service";
import { COPY } from "@/shared/constants/copy";
import "./styles.css";

interface DiagramCardProps {
  diagram: Diagram;
  onOpen: () => void;
  onUpdate?: (updated: Diagram) => void;
  onDelete?: (id: string) => void;
}

export function DiagramCard({ diagram, onOpen, onUpdate, onDelete }: DiagramCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [showAddToTeam, setShowAddToTeam] = useState(false);
  const [userTeams, setUserTeams] = useState<UserTeam[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [flashMessage, setFlashMessage] = useState<{ text: string, variant: 'success' | 'danger' } | null>(null);

  const { title, description } = diagram;
  const type = diagram.type || "Diagram";
  const variant = diagram.variant || "accent";
  const date = diagram.created_at ? new Date(diagram.created_at).toLocaleDateString() : "Just now";

  useEffect(() => {
    if (showAddToTeam) {
      teamService.findAll().then(setUserTeams).catch(() => {
        setFlashMessage({ text: 'Failed to load teams.', variant: 'danger' });
        setTimeout(() => setFlashMessage(null), 5000);
      });
    }
  }, [showAddToTeam]);

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
    if (!selectedTeamId) return;
    try {
      const team = userTeams.find(t => t.team_id === selectedTeamId);
      await diagramService.addToTeam(diagram.id, selectedTeamId);
      setFlashMessage({
        text: team?.role === 'admin'
          ? 'Diagram successfully added to the team.'
          : 'Request sent. Wait for admin approval.',
        variant: 'success'
      });
      setShowAddToTeam(false);
      setTimeout(() => setFlashMessage(null), 5000);
    } catch (err) {
      setFlashMessage({ text: 'Failed to add to the team.', variant: 'danger' });
      setTimeout(() => setFlashMessage(null), 5000);
    }
  };

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
        </div>
        <div className="diagram-card-divider" />
        <div className="diagram-card-footer">
          <span className="diagram-card-date">{date}</span>
          <span onClick={(e) => e.stopPropagation()}>
            <ActionMenu>
              <ActionMenu.Anchor>
                <IconButton icon={KebabHorizontalIcon} aria-label="Options" variant="invisible" size="small" />
              </ActionMenu.Anchor>
              <ActionMenu.Overlay>
                <ActionList>
                  <ActionList.Item onSelect={() => setIsEditDialogOpen(true)}>
                    <ActionList.LeadingVisual>
                      <PencilIcon />
                    </ActionList.LeadingVisual>
                    Edit
                  </ActionList.Item>
                  <ActionList.Item onSelect={() => setShowAddToTeam(true)}>
                    <ActionList.LeadingVisual>
                      <PeopleIcon />
                    </ActionList.LeadingVisual>
                    Add to Team
                  </ActionList.Item>
                  <ActionList.Item variant="danger" onSelect={() => setIsDeleteDialogOpen(true)}>
                    <ActionList.LeadingVisual>
                      <TrashIcon />
                    </ActionList.LeadingVisual>
                    Delete
                  </ActionList.Item>
                </ActionList>
              </ActionMenu.Overlay>
            </ActionMenu>
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
              setIsEditDialogOpen(false);
            } catch (err) {
              // Silently fail or show error
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
          width="small"
          onClose={() => setShowAddToTeam(false)}
          footerButtons={[
            { buttonType: 'default', content: COPY.common.cancel, onClick: () => setShowAddToTeam(false) },
            {
              buttonType: 'primary',
              content: 'Add',
              onClick: handleAddToTeam
            }
          ]}
        >
          <Box sx={{ p: 3 }}>
            <Text sx={{ display: 'block', mb: 2 }}>Select team:</Text>
            <Select
              value={selectedTeamId}
              onChange={(e) => setSelectedTeamId(e.target.value)}
              sx={{ width: '100%' }}
            >
              <Select.Option value="">Select a team...</Select.Option>
              {userTeams.map(ut => (
                <Select.Option key={ut.team_id} value={ut.team_id}>
                  {ut.Teams?.name || ut.teams?.name}
                </Select.Option>
              ))}
            </Select>
          </Box>
        </Dialog>
      )}

      {flashMessage && (
        <Box sx={{ position: 'fixed', bottom: 24, right: 24, zIndex: 100 }}>
          <Flash variant={flashMessage.variant}>
            {flashMessage.text}
          </Flash>
        </Box>
      )}
    </>
  );
}
