import { Module } from '@nestjs/common';
import { UsersController } from './index.controller';
import { UsersService } from './index.service';
import { AuthModule } from '../auth/index.module';
import { UsersRepository } from './index.repository';

@Module({
  imports: [AuthModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
