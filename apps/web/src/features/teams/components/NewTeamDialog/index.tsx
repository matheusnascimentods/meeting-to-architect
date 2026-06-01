import { useState } from "react";
import { Dialog, Box, TextInput, FormControl, Flash, Spinner, Text } from "@primer/react";
import { teamService } from "../../services/team.service";

interface Props {
  onClose: () => void;
  onSuccess?: (team: any) => void;
}

export function NewTeamDialog({ onClose, onSuccess }: Props) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!name.trim() || loading) return;

    setLoading(true);
    setError(null);

    try {
      const team = await teamService.create({ name });
      onSuccess?.(team);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create team. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      title="Create New Team"
      onClose={onClose}
      footerButtons={[
        { content: "Cancel", onClick: onClose, disabled: loading },
        {
          content: loading ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Spinner size="small" />
              <Text>Creating...</Text>
            </Box>
          ) : (
            "Create Team"
          ),
          buttonType: "primary",
          onClick: handleCreate,
          disabled: !name.trim() || loading,
        },
      ]}
    >
      <Box sx={{ p: 3 }}>
        {error && (
          <Flash variant="danger" sx={{ mb: 3 }}>
            {error}
          </Flash>
        )}
        <FormControl>
          <FormControl.Label>Team Name</FormControl.Label>
          <TextInput
            placeholder="App development, site creation, etc..."
            block
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            autoFocus
          />
          <FormControl.Caption>
            Give your team a name that everyone will recognize.
          </FormControl.Caption>
        </FormControl>
      </Box>
    </Dialog>
  );
}
