import { Agent, Gemini } from '@google/adk'
import { loadPrompt } from '../helpers/prompt.helper'

export function createTranscriptAnalyzerAgent(gemini: Gemini): Agent {
    return new Agent({
        name: 'transcript-analyzer',
        description: 'Extracts technical context from transcript files',
        model: gemini,
        instruction: loadPrompt('transcript-analyzer.md'),
    })
}
