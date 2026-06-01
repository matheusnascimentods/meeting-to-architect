import { Module } from '@nestjs/common';
import { SupabaseModule } from './modules/supabase/index.module';
import { UsersModule } from './modules/users/index.module';
import { ConfigModule } from '@nestjs/config';
import { AgentsModule } from './modules/agents/index.module';
import { AuthModule } from './modules/auth/index.module';
import { DiagramsModule } from './modules/diagrams/index.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './modules/auth/index.guard';
import { TeamsModule } from './modules/teams/index.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SupabaseModule,
    UsersModule,
    AgentsModule,
    AuthModule,
    DiagramsModule,
    TeamsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
