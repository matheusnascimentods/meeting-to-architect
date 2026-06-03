import { Module } from '@nestjs/common';
import { ApprovalsController } from './index.controller';
import { ApprovalsService } from './index.service';
import { ApprovalsRepository } from './index.repository';

@Module({
  controllers: [ApprovalsController],
  providers: [ApprovalsService, ApprovalsRepository],
  exports: [ApprovalsService, ApprovalsRepository],
})
export class ApprovalsModule {}
