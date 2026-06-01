import { Module } from '@nestjs/common';
import { TeamsController } from './index.controller';
import { TeamsService } from './index.service';

@Module({
  controllers: [TeamsController],
  providers: [TeamsService],
  exports: [TeamsService],
})
export class TeamsModule {}
