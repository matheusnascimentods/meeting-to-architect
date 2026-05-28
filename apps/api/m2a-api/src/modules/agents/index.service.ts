import { Agent, InMemorySessionService, Runner, Gemini } from '@google/adk'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { DiagramResponse, DiagramResponseSchema } from './index.schema'
import { getFile } from './helpers/file.helper'
import { loadPrompt } from './helpers/prompt.helper'

@Injectable()
export class AgentService {
    private architectureAgent: Agent
    private transcriptAnalyzer: Agent
    private gemini: Gemini

    constructor(private readonly configService: ConfigService) {
        this.gemini = new Gemini({
            model: this.configService.get<string>('GEMINI_MODEL', 'gemini-3.5-flash'),
            apiKey: this.configService.get<string>('GEMINI_API_KEY'),
        })

        this.architectureAgent = new Agent({
            name: 'architecture-architect',
            description: 'Analyzes transcripts and generates Mermaid diagrams',
            model: this.gemini,
            instruction: loadPrompt('unified-architect.md'),
        })

        this.transcriptAnalyzer = new Agent({
            name: 'transcript-analyzer',
            description: 'Extracts technical context from transcript files',
            model: this.gemini,
            instruction: loadPrompt('transcript-analyzer.md'),
        })
    }

    async generateDiagram(
        file: Express.Multer.File,
        diagramType: 'sequence' | 'class' | 'c4',
    ): Promise<DiagramResponse> {
        const transcript = await this.runAgent(this.transcriptAnalyzer, [getFile(file), { text: 'Extract the technical context from this transcript file.' }])

        const response = await this.runAgent(this.architectureAgent, [{ text: `Transcript: \n${transcript}` }])

        try {
            return DiagramResponseSchema.parse(JSON.parse(response))
        } catch (error) {
            throw new Error(`Invalid response format from agent: ${error instanceof Error ? error.message : String(error)}`)
        }
    }

    private async runAgent(agent: Agent, parts: any[]): Promise<string> {
        const sessionService = new InMemorySessionService()
        const runner = new Runner({ agent, appName: 'm2a', sessionService })
        const session = await sessionService.createSession({ appName: 'm2a', userId: 'system' })

        let text = ''
        for await (const event of runner.runAsync({ userId: 'system', sessionId: session.id, newMessage: { role: 'user', parts } })) {
            if (event.content?.parts) {
                text += event.content.parts.filter((p) => p.text).map((p) => p.text).join('')
            }
        }

        if (!text) throw new Error(`No text generated from agent: ${agent.name}`)
        return text
    }
}