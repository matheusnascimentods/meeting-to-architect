import { useState } from "react";
import { Box, Button, Dialog, FormControl, TextInput } from "@primer/react";
import { teamService } from "../../services/team.service";
import { Team } from "../../types";

interface Props {
  team: Team;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditTeamDialog({ team, onClose, onSuccess }: Props) {
  const [name, setName] = useState(team.name);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      await teamService.update(team.id, { name });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to update team", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog onClose={onClose} title="Edit Team" width="small">
      <Box as="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
        <FormControl>
          <FormControl.Label>Team Name</FormControl.Label>
          <TextInput
            block
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter team name"
            required
            autoFocus
          />
        </FormControl>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
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
