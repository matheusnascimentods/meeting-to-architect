import { Global, Module } from '@nestjs/common';
import { SupabaseService } from './index.service';

@Global()
@Module({
  providers: [SupabaseService],
  exports: [SupabaseService],
})
export class SupabaseModule {}
