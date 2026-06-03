import { Module } from '@nestjs/common';
import { MembersController } from './index.controller';
import { MembersService } from './index.service';
import { SupabaseModule } from '../supabase/index.module';

@Module({
  imports: [SupabaseModule],
  controllers: [MembersController],
  providers: [MembersService],
  exports: [MembersService],
})
export class MembersModule {}
