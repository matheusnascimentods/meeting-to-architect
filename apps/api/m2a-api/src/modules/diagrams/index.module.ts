import { Module } from '@nestjs/common';
import { DiagramsController } from './index.controller';
import { DiagramsService } from './index.service';
import { AuthModule } from '../auth/index.module';

@Module({
  imports: [AuthModule],
  controllers: [DiagramsController],
  providers: [DiagramsService],
  exports: [DiagramsService],
})
export class DiagramsModule {}
