import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from '../supabase/index.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/index.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const { data } = await this.supabaseService
      .getClient()
      .from('Users')
      .select('*')
      .eq('email', email)
      .single<User>();

    if (!data) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(password, data.password_hash);
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
