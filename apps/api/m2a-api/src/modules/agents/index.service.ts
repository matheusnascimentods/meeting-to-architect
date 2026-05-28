import { Agent, InMemorySessionService, Runner, Gemini } from '@google/adk';
import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { readFileSync } from 'fs';
import { join } from 'path';
import { z } from 'zod';
import { MarkdownParser } from './parsers/markdown.parser';
import { PdfParser } from './parsers/pdf.parser';

const DiagramResponseSchema = z.object({
    title: z.string(),
    description: z.string(),
    mermaidCode: z.string(),
});

type DiagramResponse = z.infer<typeof DiagramResponseSchema>;

@Injectable()
export class AgentService {
    private architectureAgent: Agent;
    private transcriptAnalyzer: Agent;

    constructor(private readonly configService: ConfigService) {
        const apiKey = this.configService.get<string>('GOOGLE_API_KEY');

        this.architectureAgent = new Agent({
            name: 'architecture-architect',
            description: 'Analyzes transcripts and generates Mermaid diagrams with titles and descriptions',
            model: new Gemini({
                model: 'gemini-3.5-flash',
                apiKey,
            }),
            instruction: this.loadPrompt('unified-architect.md'),
        });

        this.transcriptAnalyzer = new Agent({
            name: 'transcript-analyzer',
            description: 'Extracts technical context from transcript files',
            model: new Gemini({
                model: 'gemini-3.5-flash',
                apiKey,
            }),
            instruction: this.loadPrompt('transcript-analyzer.md'),
        });

    }

    private resolveFilePart(file: Express.Multer.File) {
        const ext = file.originalname.split('.').pop()?.toLowerCase();

        if (ext === 'md') return MarkdownParser.parse(file.buffer);
        if (ext === 'pdf') return PdfParser.parse(file.buffer);

        throw new BadRequestException(`Unsupported file type: .${ext ?? 'unknown'}`);
    }

    private async analyzeTranscript(file: Express.Multer.File): Promise<string> {
        const sessionService = new InMemorySessionService();
        const runner = new Runner({
            agent: this.transcriptAnalyzer,
            appName: 'm2a',
            sessionService,
        });

        const session = await sessionService.createSession({
            appName: 'm2a',
            userId: 'system',
        });

        const filePart = this.resolveFilePart(file);

        const result = runner.runAsync({
            userId: 'system',
            sessionId: session.id,
            newMessage: {
                role: 'user',
                parts: [
                    filePart,
                    {
                        text: 'Extract the technical context from this transcript file.',
                    },
                ],
            },
        });

        let text = '';
        for await (const event of result) {
            if (event.content?.parts) {
                for (const part of event.content.parts) {
                    if (part.text) {
                        text += part.text;
                    }
                }
            }
        }

        if (!text) throw new Error('No text generated');
        return text;
    }

    async generateDiagram(
        file: Express.Multer.File,
        diagramType: 'sequence' | 'class' | 'c4',
    ): Promise<DiagramResponse> {
        const transcript = await this.analyzeTranscript(file);

        const promptTemplate = this.loadPrompt('unified-architect.md');
        this.architectureAgent.instruction = promptTemplate.replace(
            '{{diagramType}}',
            diagramType,
        );

        const sessionService = new InMemorySessionService();
        const runner = new Runner({
            agent: this.architectureAgent,
            appName: 'm2a',
            sessionService,
        });

        const session = await sessionService.createSession({
            appName: 'm2a',
            userId: 'system',
        });

        const result = runner.runAsync({
            userId: 'system',
            sessionId: session.id,
            newMessage: {
                role: 'user',
                parts: [{ text: `Transcript: \n${transcript}` }],
            },
        });

        let text = '';
        for await (const event of result) {
            if (event.content?.parts) {
                for (const part of event.content.parts) {
                    if (part.text) {
                        text += part.text;
                    }
                }
            }
        }

        if (!text) {
            throw new Error('No response generated from the agent');
        }

        try {
            const parsed: unknown = JSON.parse(text);
            return DiagramResponseSchema.parse(parsed);
        } catch (error) {
            console.error('Failed to parse agent response:', text);
            const errorMessage =
                error instanceof Error ? error.message : String(error);
            throw new Error(`Invalid response format from agent: ${errorMessage}`);
        }
    }

    private loadPrompt(filename: string): string {
        return readFileSync(join(__dirname, 'prompts', filename), 'utf-8');
    }
}
