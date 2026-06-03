import { Module } from '@nestjs/common';
import { ApprovalsController } from './index.controller';
import { ApprovalsService } from './index.service';
import { SupabaseModule } from '../supabase/index.module';

@Module({
  imports: [SupabaseModule],
  controllers: [ApprovalsController],
  providers: [ApprovalsService],
  exports: [ApprovalsService],
})
export class ApprovalsModule {}
