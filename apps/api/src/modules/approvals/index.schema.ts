import { z } from 'zod';

export const respondApprovalSchema = z.object({
  approve: z.boolean(),
});

export type RespondApprovalDto = z.infer<typeof respondApprovalSchema>;
