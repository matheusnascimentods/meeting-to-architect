import z from 'zod';

export const DiagramTypeSchema = z.enum([
  'class',
  'component',
  'object',
  'deployment',
  'package',
  'composite',
  'sequence',
  'activity',
  'use-case',
  'state',
  'communication',
  'timing',
  'interaction-overview',
  'c4',
]);

export type DiagramType = z.infer<typeof DiagramTypeSchema>;

export const DiagramResponseSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string(),
  description: z.string(),
  mermaid_code: z.string(),
  created_by: z.string().optional(),
});

export type DiagramResponse = z.infer<typeof DiagramResponseSchema>;
