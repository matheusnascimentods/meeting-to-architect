import { Module } from '@nestjs/common';
import { UsersController } from './index.controller';
import { UsersService } from './index.service';
import { AuthModule } from '../auth/index.module';

@Module({
  imports: [AuthModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
