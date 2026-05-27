import { Agent, InMemorySessionService, Runner, Gemini } from "@google/adk";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { readFileSync } from "fs";
import { join } from "path";

@Injectable()
export class AgentService {
    private transcriptAnalyzer: Agent
    private diagramGenerator: Agent

    constructor(private readonly configService: ConfigService) {
        const apiKey = this.configService.get<string>('GOOGLE_API_KEY');

        this.transcriptAnalyzer = new Agent({
            name: "transcript-analyzer",
            description: "Extracts technical context from meeting transcripts",
            model: new Gemini({
                model: "gemini-2.5-flash",
                apiKey
            }),
            instruction: this.loadPrompt('transcript-analyzer', 'prompt.md')
        })

        this.diagramGenerator = new Agent({
            name: "diagram-generator",
            description: "Generates Mermaid diagrams from structured context",
            model: new Gemini({
                model: "gemini-2.5-flash",
                apiKey
            }),
            instruction: this.loadPrompt('diagram-generator', 'prompt.md')
        })
    }

    async generateDiagram(
        transcript: string,
        diagramType: 'sequence' | 'class' | 'c4',
    ): Promise<string> {
        const context = await this.analyzeTranscript(transcript)
        const mermaidCode = await this.runDiagramGenerator(context, diagramType)
        return mermaidCode
    }

    private async analyzeTranscript(transcript: string): Promise<string> {
        const sessionService = new InMemorySessionService()
        const runner = new Runner({
            agent: this.transcriptAnalyzer,
            appName: 'm2a',
            sessionService
        })

        const session = await sessionService.createSession({
            appName: 'm2a',
            userId: 'system',
        })

        const result = runner.runAsync({
            userId: 'system',
            sessionId: session.id,
            newMessage: {
                role: 'user',
                parts: [{ text: transcript }],
            },
        })

        let text = ''
        for await (const event of result) {
            console.log('ADK event:', JSON.stringify(event, null, 2))
            if (event.content?.parts) {
                for (const part of event.content.parts) {
                    if (part.text) {
                        text += part.text
                    }
                }
            }
        }

        if (!text) {
            throw new Error('No text generated')
        }

        return text;
    }

    private async runDiagramGenerator(
        context: string,
        diagramType: 'sequence' | 'class' | 'c4',
    ): Promise<string> {
        const typePrompt = this.loadPrompt('diagram-generator', `${diagramType}.md`)
        this.diagramGenerator.instruction = typePrompt

        const sessionService = new InMemorySessionService()
        const runner = new Runner({
            agent: this.diagramGenerator,
            appName: 'm2a',
            sessionService
        })

        const session = await sessionService.createSession({
            appName: 'm2a',
            userId: 'system',
        })

        const result = runner.runAsync({
            userId: 'system',
            sessionId: session.id,
            newMessage: {
                role: 'user',
                parts: [{ text: context }],
            },
        })

        let text = ''
        for await (const event of result) {
            console.log('ADK event:', JSON.stringify(event, null, 2))
            if (event.content?.parts) {
                for (const part of event.content.parts) {
                    if (part.text) {
                        text += part.text
                    }
                }
            }
        }

        if (!text) {
            throw new Error('No text generated')
        }

        return text;
    }

    private loadPrompt(agent: string, filename: string): string {
        return readFileSync(
            join(__dirname, "prompts", agent, filename),
            "utf-8"
        );
    }
}