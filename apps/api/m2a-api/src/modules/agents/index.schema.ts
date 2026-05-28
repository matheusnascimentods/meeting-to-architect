import z from "zod";

export const DiagramResponseSchema = z.object({
    id: z.number().optional(),
    title: z.string(),
    description: z.string(),
    data: z.string(),
    createdByUser: z.string().optional(),
});

export type DiagramResponse = z.infer<typeof DiagramResponseSchema>;