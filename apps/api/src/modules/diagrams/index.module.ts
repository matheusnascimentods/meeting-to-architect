import { Module } from '@nestjs/common';
import { DiagramsController } from './index.controller';
import { DiagramsService } from './index.service';
import { AuthModule } from '../auth/index.module';
import { DiagramsRepository } from './index.repository';

@Module({
  imports: [AuthModule],
  controllers: [DiagramsController],
  providers: [DiagramsService, DiagramsRepository],
  exports: [DiagramsService, DiagramsRepository],
})
export class DiagramsModule {}
