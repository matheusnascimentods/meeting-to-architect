import { Body, Controller, Post } from '@nestjs/common';
import { AgentService } from './index.service';

class GenerateDiagramDto {
  transcriptText: string;
  diagramType: 'sequence' | 'c4' | 'class';
}

@Controller('agents')
export class AgentController {
  constructor(private readonly agents: AgentService) {}

  @Post('generate')
  async generate(@Body() body: GenerateDiagramDto) {
    return this.agents.generateDiagram(body.transcriptText, body.diagramType);
  }
}
