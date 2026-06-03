import { Module } from '@nestjs/common';
import { TrashController } from './index.controller';
import { TrashService } from './index.service';
import { SupabaseModule } from '../supabase/index.module';

@Module({
  imports: [SupabaseModule],
  controllers: [TrashController],
  providers: [TrashService],
  exports: [TrashService],
})
export class TrashModule {}
