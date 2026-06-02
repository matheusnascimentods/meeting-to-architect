import { Agent, Gemini, zodObjectToSchema } from '@google/adk';
import { loadPrompt } from '../helpers/prompt.helper';
import { z } from 'zod';

export const TranscriptAnalyzerInputSchema = z.object({
  documentContent: z
    .string()
    .describe('The raw text content of the transcript or document to analyze'),
});

export function createTranscriptAnalyzerAgent(gemini: Gemini): Agent {
  return new Agent({
    name: 'transcript-analyzer',
    description:
      'Analyzes raw meeting transcript or project document text and extracts a structured technical summary',
    model: gemini,
    instruction: loadPrompt('transcript-analyzer.md'),
    inputSchema: zodObjectToSchema(TranscriptAnalyzerInputSchema),
  });
}
