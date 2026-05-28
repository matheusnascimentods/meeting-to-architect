import { Module } from '@nestjs/common';
import { AgentService } from './index.service';
import { AgentController } from './index.controller';
import { SupabaseModule } from '../supabase/index.module';

@Module({
  imports: [SupabaseModule],
  providers: [AgentService],
  controllers: [AgentController],
  exports: [AgentService],
})
export class AgentsModule {}
