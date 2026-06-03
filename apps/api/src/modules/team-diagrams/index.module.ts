import { Module } from '@nestjs/common';
import { TeamDiagramsController } from './index.controller';
import { TeamDiagramsService } from './index.service';
import { TeamDiagramsRepository } from './index.repository';

@Module({
  controllers: [TeamDiagramsController],
  providers: [TeamDiagramsService, TeamDiagramsRepository],
  exports: [TeamDiagramsService, TeamDiagramsRepository],
})
export class TeamDiagramsModule {}
