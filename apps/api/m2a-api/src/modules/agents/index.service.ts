import {
  Agent,
  InMemorySessionService,
  Runner,
  Gemini,
  setLogLevel,
  LogLevel,
} from '@google/adk';
import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DiagramResponse,
  DiagramResponseSchema,
  DiagramType,
} from './index.schema';
import { getFile } from './helpers/file.helper';
import { SupabaseService } from '../supabase/index.service';
import { DiagramsService } from '../diagrams/index.service';
import { createSoftwareArchitectAgent } from './agents/software-architect.agent';

@Injectable()
export class AgentService {
  private readonly logger = new Logger(AgentService.name);
  private softwareArchitect: Agent;
  private gemini: Gemini;

  constructor(
    private readonly configService: ConfigService,
    private readonly supabase: SupabaseService,
    private readonly diagramsService: DiagramsService,
  ) {
    setLogLevel(LogLevel.ERROR);

    this.gemini = new Gemini({
      model: this.configService.get<string>('GEMINI_MODEL', 'gemini-1.5-flash'),
      apiKey: this.configService.get<string>('GEMINI_API_KEY'),
    });

    this.softwareArchitect = createSoftwareArchitectAgent(this.gemini);
  }

  async generateDiagram(
    file: Express.Multer.File,
    diagramType: DiagramType,
    userId: string,
  ): Promise<DiagramResponse> {
    const response = await this.runAgent(this.softwareArchitect, [
      getFile(file),
      {
        text: `Generate a ${diagramType} diagram based on the provided document. Extract technical details first using transcript-analyzer, then call the appropriate architect to generate the diagram, and return the final JSON directly.`,
      },
    ]);

    let cleanedResponse = response;

    try {
      // First attempt: strip markdown backticks
      cleanedResponse = response.replace(/```(?:json)?/gi, '').trim();

      // Second attempt: try to find a JSON block if the cleaned response still isn't valid JSON
      if (!cleanedResponse.startsWith('{')) {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          cleanedResponse = jsonMatch[0];
        }
      }

      const parsed = DiagramResponseSchema.parse(JSON.parse(cleanedResponse));

      const data = await this.diagramsService.save({
        title: parsed.title,
        description: parsed.description,
        mermaid_code: parsed.mermaid_code,
        created_by: userId,
        type: diagramType,
      });

      return data as DiagramResponse;
    } catch (error) {
      this.logger.error(
        `Failed to parse agent output. Raw response: ${response}`,
      );
      this.logger.error(`Cleaned response attempted: ${cleanedResponse}`);
      this.logger.error(
        `Parse Error: ${error instanceof Error ? error.stack : String(error)}`,
      );

      throw new BadRequestException(
        `Failed to parse agent output or save diagram. The agent might have returned a conversational response instead of JSON. Check server logs for the raw output.`,
      );
    }
  }

  private async runAgent(agent: Agent, parts: any[]): Promise<string> {
    const sessionService = new InMemorySessionService();
    const runner = new Runner({ agent, appName: 'm2a', sessionService });
    const session = await sessionService.createSession({
      appName: 'm2a',
      userId: 'system',
    });

    let text = '';
    for await (const event of runner.runAsync({
      userId: 'system',
      sessionId: session.id,
      newMessage: { role: 'user', parts },
    })) {
      if (event.errorMessage) {
        throw new BadRequestException(
          `Agent ${agent.name} failed: ${event.errorMessage}`,
        );
      }
      if (event.content?.parts) {
        text += event.content.parts
          .filter((p) => p.text)
          .map((p) => p.text)
          .join('');
      }
    }

    if (!text)
      throw new BadRequestException(
        `No text generated from agent: ${agent.name}`,
      );
    return text;
  }
}
