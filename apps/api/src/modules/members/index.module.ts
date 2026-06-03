import { Module } from '@nestjs/common';
import { MembersController } from './index.controller';
import { MembersService } from './index.service';
import { MembersRepository } from './index.repository';

@Module({
  controllers: [MembersController],
  providers: [MembersService, MembersRepository],
  exports: [MembersService, MembersRepository],
})
export class MembersModule {}
