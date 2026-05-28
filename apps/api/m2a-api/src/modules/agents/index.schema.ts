import z from "zod";

export const DiagramResponseSchema = z.object({
    title: z.string(),
    description: z.string(),
    mermaidCode: z.string(),
});

export type DiagramResponse = z.infer<typeof DiagramResponseSchema>;