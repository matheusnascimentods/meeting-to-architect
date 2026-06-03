import { Module } from '@nestjs/common';
import { InvitesController } from './index.controller';
import { InvitesService } from './index.service';
import { SupabaseModule } from '../supabase/index.module';

@Module({
  imports: [SupabaseModule],
  controllers: [InvitesController],
  providers: [InvitesService],
  exports: [InvitesService],
})
export class InvitesModule {}
