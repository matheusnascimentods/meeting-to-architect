import { useState } from "react";
import { Box, Button, Dialog, FormControl, TextInput, Text } from "@primer/react";
import { teamService } from "../../../services";
import { Team } from "../../../types";
import { useToast } from "@/shared/hooks/use-toast";
import { EditTeamDialogProps } from "./index.types";

export function EditTeamDialog({ team, onClose, onSuccess }: EditTeamDialogProps) {
  const [name, setName] = useState(team.name);
  const [description, setDescription] = useState(team.description || "");
  const [loading, setLoading] = useState(false);
  const { success, error } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      await teamService.update(team.id, { name, description });
      success("Team updated successfully.");
      onSuccess();
      onClose();
    } catch (err) {
      error("Failed to update team.");
      console.error("Failed to update team", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog onClose={onClose} title="Edit Team">
      <Box as="form" onSubmit={handleSubmit} sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Text sx={{ color: 'fg.muted', fontSize: 1 }}>
          Update your team details. This will be visible to all members.
        </Text>
        
        <FormControl>
          <FormControl.Label>Team Name</FormControl.Label>
          <TextInput
            block
            size="large"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter team name"
            required
            autoFocus
          />
        </FormControl>

        <FormControl>
          <FormControl.Label>Description</FormControl.Label>
          <TextInput
            block
            size="large"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter team description"
          />
        </FormControl>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" loading={loading} disabled={!name.trim()}>
            Save Changes
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
