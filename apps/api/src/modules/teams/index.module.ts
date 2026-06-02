import { Module } from '@nestjs/common';
import { TeamsController } from './index.controller';
import { TeamsService } from './index.service';
import { AuthModule } from '../auth/index.module';

@Module({
  imports: [AuthModule],
  controllers: [TeamsController],
  providers: [TeamsService],
  exports: [TeamsService],
})
export class TeamsModule {}
