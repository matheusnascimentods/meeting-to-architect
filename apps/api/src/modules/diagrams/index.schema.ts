import z from 'zod';

export const UpdateDiagramSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  mermaid_code: z.string().optional(),
  type: z.string().optional(),
});

export const createDiagramSchema = z.object({
  title: z.string(),
  description: z.string(),
  mermaid_code: z.string(),
  created_by: z.string().uuid(),
  type: z.string(),
});

export const addToTeamSchema = z.object({
  team_id: z.string().uuid(),
});

export type UpdateDiagramDto = z.infer<typeof UpdateDiagramSchema>;
export type CreateDiagramDto = z.infer<typeof createDiagramSchema>;
export type AddToTeamDto = z.infer<typeof addToTeamSchema>;
