import { Module } from '@nestjs/common';
import { TeamDiagramsController } from './index.controller';
import { TeamDiagramsService } from './index.service';
import { SupabaseModule } from '../supabase/index.module';

@Module({
  imports: [SupabaseModule],
  controllers: [TeamDiagramsController],
  providers: [TeamDiagramsService],
  exports: [TeamDiagramsService],
})
export class TeamDiagramsModule {}
