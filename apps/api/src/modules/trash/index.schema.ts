import { z } from 'zod';

export const trashSchema = z.object({
  id: z.string().uuid(),
});

export type TrashDto = z.infer<typeof trashSchema>;
