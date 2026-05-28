import { Module } from '@nestjs/common';
import { DiagramsController } from './index.controller';
import { DiagramsService } from './index.service';

@Module({
  controllers: [DiagramsController],
  providers: [DiagramsService],
  exports: [DiagramsService],
})
export class DiagramsModule {}
