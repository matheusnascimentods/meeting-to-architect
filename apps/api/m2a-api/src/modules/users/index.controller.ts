import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { UsersService } from './index.service';
import type { CreateUserDto } from './index.schema';
import { SkipAuth } from '../auth/index.decorator';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @SkipAuth()
  @Post()
  async create(@Body() body: CreateUserDto) {
    return this.usersService.create(body.email, body.password, body.name);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @SkipAuth()
  @Get('get-by-email/:email')
  async findByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }
}
