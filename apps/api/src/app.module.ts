import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/index.module';
import { ConfigModule } from '@nestjs/config';
import { AgentsModule } from './modules/agents/index.module';
import { AuthModule } from './modules/auth/index.module';
import { DiagramsModule } from './modules/diagrams/index.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './modules/auth/index.guard';
import { TeamsModule } from './modules/teams/index.module';
import { InvitesModule } from './modules/invites/index.module';
import { MembersModule } from './modules/members/index.module';
import { ApprovalsModule } from './modules/approvals/index.module';
import { TrashModule } from './modules/trash/index.module';
import { TeamDiagramsModule } from './modules/team-diagrams/index.module';
import { PrismaModule } from './modules/prisma/index.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    UsersModule,
    AgentsModule,
    AuthModule,
    DiagramsModule,
    TeamsModule,
    InvitesModule,
    MembersModule,
    ApprovalsModule,
    TrashModule,
    TeamDiagramsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
