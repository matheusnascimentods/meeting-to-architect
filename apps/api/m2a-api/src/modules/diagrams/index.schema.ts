import z from 'zod';

export const UpdateDiagramSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  mermaid_code: z.string().optional(),
  type: z.string().optional(),
});

export type UpdateDiagramDto = z.infer<typeof UpdateDiagramSchema>;
