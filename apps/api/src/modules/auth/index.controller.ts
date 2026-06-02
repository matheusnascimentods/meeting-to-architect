import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './index.service';
import type { LoginDto } from './index.schema';
import { SkipAuth } from './index.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SkipAuth()
  @Post('login')
  async login(@Body() login: LoginDto) {
    return this.authService.login(login.email, login.password);
  }
}
