import { Module } from '@nestjs/common';
import { TrashController } from './index.controller';
import { TrashService } from './index.service';
import { TrashRepository } from './index.repository';

@Module({
  controllers: [TrashController],
  providers: [TrashService, TrashRepository],
  exports: [TrashService, TrashRepository],
})
export class TrashModule {}
