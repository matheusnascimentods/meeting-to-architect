import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthRepository } from './index.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly repository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const data = await this.repository.findByEmail(email);

    if (!data) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(password, data.passwordHash);
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    return {
      message: 'Login successful',
      token: await this.createToken({ sub: data.id, email: data.email }),
    };
  }

  async createToken({ sub, email }): Promise<string> {
    return this.jwtService.sign({ sub, email });
  }
}
