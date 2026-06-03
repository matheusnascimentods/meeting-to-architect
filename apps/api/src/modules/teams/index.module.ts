import { Module } from '@nestjs/common';
import { TeamsController } from './index.controller';
import { TeamsService } from './index.service';
import { AuthModule } from '../auth/index.module';
import { TeamsRepository } from './index.repository';

@Module({
  imports: [AuthModule],
  controllers: [TeamsController],
  providers: [TeamsService, TeamsRepository],
  exports: [TeamsService, TeamsRepository],
})
export class TeamsModule {}
