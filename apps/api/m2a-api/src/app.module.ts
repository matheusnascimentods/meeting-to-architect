import { Module } from '@nestjs/common';
import { SupabaseModule } from './modules/supabase/index.module';
import { UsersModule } from './modules/users/index.module';
import { ConfigModule } from '@nestjs/config';
import { AgentsModule } from './modules/agents/index.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SupabaseModule,
    UsersModule,
    AgentsModule,
  ],
})
export class AppModule { }
