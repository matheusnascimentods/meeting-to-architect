import { Agent, Gemini, zodObjectToSchema } from '@google/adk';
import { loadPrompt } from '../helpers/prompt.helper';
import { z } from 'zod';
import { AgentOutputSchema } from './uml-architect.agent';
import { C4_DIAGRAM_TYPES } from '../../../shared/diagram-type.schema';

export const C4ArchitectInputSchema = z.object({
  technicalContext: z
    .string()
    .describe('The technical summary or context extracted from the transcript'),
  diagramType: z
    .enum(C4_DIAGRAM_TYPES)
    .describe(
      'The C4 diagram type/level to generate: C4_CONTEXT, C4_CONTAINER, C4_COMPONENT, C4_CODE',
    ),
});

export function createC4ArchitectAgent(gemini: Gemini): Agent {
  return new Agent({
    name: 'c4-architect',
    description:
      'Generates C4 model diagrams (C4_CONTEXT, C4_CONTAINER, C4_COMPONENT, C4_CODE) using Mermaid C4 extension syntax',
    model: gemini,
    instruction: loadPrompt('c4-architect.md'),
    inputSchema: zodObjectToSchema(C4ArchitectInputSchema),
    outputSchema: zodObjectToSchema(AgentOutputSchema),
  });
}
