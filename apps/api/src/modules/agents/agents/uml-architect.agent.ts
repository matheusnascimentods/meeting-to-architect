import { Agent, Gemini, zodObjectToSchema } from '@google/adk';
import { loadPrompt } from '../helpers/prompt.helper';
import { z } from 'zod';
import { UML_DIAGRAM_TYPES } from '../../../shared/diagram-type.schema';

export const UmlArchitectInputSchema = z.object({
  technicalContext: z
    .string()
    .describe('The technical summary or context extracted from the transcript'),
  diagramType: z
    .enum(UML_DIAGRAM_TYPES)
    .describe(
      'The UML diagram type to generate: CLASS, PACKAGE, OBJECT, COMPONENT, DEPLOYMENT, COMPOSITE_STRUCTURE, ACTIVITY, SEQUENCE, COMMUNICATION, INTERACTION_OVERVIEW, TIMING, USE_CASE, STATE',
    ),
});

export const AgentOutputSchema = z.object({
  title: z.string().describe('Short descriptive title of the diagram'),
  description: z
    .string()
    .describe('Technical description of what the diagram represents'),
  mermaid_code: z
    .string()
    .describe(
      "Raw Mermaid syntax for the diagram (without backticks or the 'mermaid' prefix)",
    ),
});

export function createUmlArchitectAgent(gemini: Gemini): Agent {
  return new Agent({
    name: 'uml-architect',
    description:
      'Generates standard UML diagrams (13 types: structural and behavioral) using Mermaid',
    model: gemini,
    instruction: loadPrompt('uml-architect.md'),
    inputSchema: zodObjectToSchema(UmlArchitectInputSchema),
    outputSchema: zodObjectToSchema(AgentOutputSchema),
  });
}
