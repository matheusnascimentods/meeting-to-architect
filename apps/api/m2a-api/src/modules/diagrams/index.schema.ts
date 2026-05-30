import z from 'zod';

export const UpdateDiagramSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  data: z.string().optional(),
});

export type UpdateDiagramDto = z.infer<typeof UpdateDiagramSchema>;
