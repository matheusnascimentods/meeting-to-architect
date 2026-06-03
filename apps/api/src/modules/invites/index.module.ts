import { Module } from '@nestjs/common';
import { InvitesController } from './index.controller';
import { InvitesService } from './index.service';
import { InvitesRepository } from './index.repository';

@Module({
  controllers: [InvitesController],
  providers: [InvitesService, InvitesRepository],
  exports: [InvitesService, InvitesRepository],
})
export class InvitesModule {}
