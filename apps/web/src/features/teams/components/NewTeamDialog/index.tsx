import { useState } from "react";
import { Dialog, Box, TextInput, FormControl, Flash, Spinner, Text } from "@primer/react";
import { teamService } from "../../services";
import { Team } from "../../types";
import { COPY } from "@/shared/constants";
import { NewTeamDialogProps } from "./index.types";

export function NewTeamDialog({ onClose, onSuccess }: NewTeamDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!name.trim() || loading) return;

    setLoading(true);
    setError(null);

    try {
      const team = await teamService.create({ name, description });
      onSuccess?.(team);
      onClose();
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response: { data: { message: string } } };
        setError(axiosErr.response?.data?.message || "Failed to create team. Please try again.");
      } else {
        setError("Failed to create team. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      title="Create New Team"
      onClose={onClose}
      footerButtons={[
        { content: COPY.common.cancel, onClick: onClose, disabled: loading },
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

        <FormControl sx={{ mt: 3 }}>
          <FormControl.Label>Description</FormControl.Label>
          <TextInput
            placeholder="Describe what this team does..."
            block
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
          />
          <FormControl.Caption>
            A brief description of the team's purpose.
          </FormControl.Caption>
        </FormControl>
      </Box>
    </Dialog>
  );
}
