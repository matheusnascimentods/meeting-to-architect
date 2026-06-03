import { Module } from '@nestjs/common';
import { AgentService } from './index.service';
import { AgentController } from './index.controller';
import { DiagramsModule } from '../diagrams/index.module';
import { AgentsRepository } from './index.repository';

@Module({
  imports: [DiagramsModule],
  providers: [AgentService, AgentsRepository],
  controllers: [AgentController],
  exports: [AgentService, AgentsRepository],
})
export class AgentsModule {}
