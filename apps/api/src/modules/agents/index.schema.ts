import z from 'zod';
import { DiagramTypeSchema } from '../../shared/diagram-type.schema';

export { DiagramTypeSchema };
export type { DiagramType } from '../../shared/diagram-type.schema';

export const DiagramResponseSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string(),
  description: z.string(),
  type: DiagramTypeSchema.optional(),
  mermaid_code: z.string(),
  created_by: z.string().optional(),
});

export type DiagramResponse = z.infer<typeof DiagramResponseSchema>;
