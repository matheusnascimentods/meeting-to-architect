import { Agent, InMemorySessionService, Runner, Gemini } from '@google/adk'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { DiagramResponse, DiagramResponseSchema } from './index.schema'
import { getFile } from './helpers/file.helper'
import { SupabaseService } from '../supabase/index.service'
import { DiagramsService } from '../diagrams/index.service'
import { createTranscriptAnalyzerAgent } from './agents/transcript-analyzer.agent'
import { createArchitectureAgent } from './agents/architecture-architect.agent'

@Injectable()
export class AgentService {
    private transcriptAnalyzer: Agent
    private gemini: Gemini

    constructor(
        private readonly configService: ConfigService,
        private readonly supabase: SupabaseService,
        private readonly diagramsService: DiagramsService
    ) {
        this.gemini = new Gemini({
            model: this.configService.get<string>('GEMINI_MODEL', 'gemini-3.5-flash'),
            apiKey: this.configService.get<string>('GEMINI_API_KEY'),
        })

        this.transcriptAnalyzer = createTranscriptAnalyzerAgent(this.gemini)
    }

    async generateDiagram(
        file: Express.Multer.File,
        diagramType: 'sequence' | 'class' | 'c4',
        userId: string,
    ): Promise<DiagramResponse> {
        const transcript = await this.runAgent(this.transcriptAnalyzer, [getFile(file), { text: 'Extract the technical context from this transcript file.' }])

        const architectureAgent = createArchitectureAgent(this.gemini, diagramType)

        const response = await this.runAgent(architectureAgent, [{ text: `Transcript: \n${transcript}` }])
        try {
            const cleanedResponse = response.replace(/```(?:json)?/gi, '').trim()
            const parsed = DiagramResponseSchema.parse(JSON.parse(cleanedResponse))

            const data = await this.diagramsService.save({
                title: parsed.title,
                description: parsed.description,
                data: parsed.data,
                createdByUser: userId
            })

            return data as DiagramResponse
        } catch (error) {
            throw new Error(`Invalid response format or persistence error: ${error instanceof Error ? error.message : String(error)}`)
        }
    }

    private async runAgent(agent: Agent, parts: any[]): Promise<string> {
        const sessionService = new InMemorySessionService()
        const runner = new Runner({ agent, appName: 'm2a', sessionService })
        const session = await sessionService.createSession({ appName: 'm2a', userId: 'system' })

        let text = ''
        for await (const event of runner.runAsync({ userId: 'system', sessionId: session.id, newMessage: { role: 'user', parts } })) {
            if (event.errorMessage) {
                throw new Error(`Agent ${agent.name} failed: ${event.errorMessage}`)
            }
            if (event.content?.parts) {
                text += event.content.parts.filter((p) => p.text).map((p) => p.text).join('')
            }
        }

        if (!text) throw new Error(`No text generated from agent: ${agent.name}`)
        return text
    }
}