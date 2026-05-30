import { Agent, Gemini } from '@google/adk'
import { loadPrompt } from '../helpers/prompt.helper'

export function createArchitectureAgent(gemini: Gemini, diagramType: string): Agent {
    return new Agent({
        name: 'architecture-architect',
        description: 'Analyzes transcripts and generates Mermaid diagrams',
        model: gemini,
        instruction: loadPrompt('unified-architect.md').replace('{{diagramType}}', diagramType),
    })
}
