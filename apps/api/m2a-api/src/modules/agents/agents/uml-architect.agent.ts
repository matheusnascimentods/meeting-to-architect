import { Agent, Gemini, zodObjectToSchema } from '@google/adk';
import { loadPrompt } from '../helpers/prompt.helper';
import { z } from 'zod';

export const UmlArchitectInputSchema = z.object({
  technicalContext: z
    .string()
    .describe('The technical summary or context extracted from the transcript'),
  diagramType: z
    .string()
    .describe(
      'The UML diagram type to generate, e.g. sequence, class, state, activity, usecase, component, deployment',
    ),
});

export const AgentOutputSchema = z.object({
  title: z.string().describe('Short descriptive title of the diagram'),
  description: z
    .string()
    .describe('Technical description of what the diagram represents'),
  data: z
    .string()
    .describe(
      "Raw Mermaid syntax for the diagram (without backticks or the 'mermaid' prefix)",
    ),
});

export function createUmlArchitectAgent(gemini: Gemini): Agent {
  return new Agent({
    name: 'uml-architect',
    description:
      'Generates standard UML diagrams (sequence, class, state, activity, usecase, component, deployment) using Mermaid',
    model: gemini,
    instruction: loadPrompt('uml-architect.md'),
    inputSchema: zodObjectToSchema(UmlArchitectInputSchema),
    outputSchema: zodObjectToSchema(AgentOutputSchema),
  });
}
