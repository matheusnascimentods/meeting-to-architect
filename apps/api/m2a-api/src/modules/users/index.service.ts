import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/index.service';
import * as bcrypt from 'bcrypt';
import { User } from './index.schema';
import { AuthService } from '../auth/index.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly supabase: SupabaseService,
    private readonly authService: AuthService,
  ) {}

  async create(email: string, password: string, name: string) {
    const existing = await this.findByEmail(email);
    if (existing) throw new ConflictException('Email already in use');

    const hash = await bcrypt.hash(password, 10);

    const { data, error } = await this.supabase
      .getClient()
      .from('User')
      .insert([
        {
          email,
          password: hash,
          name,
        },
      ])
      .select()
      .single<User>();

    if (error || !data)
      throw new Error(error?.message || 'Error creating user');

    return {
      message: 'User was created successfully',
      token: await this.authService.createToken({
        sub: data.id,
        email: data.email,
      }),
    };
  }

  async findById(id: string): Promise<User> {
    const { data, error } = await this.supabase
      .getClient()
      .from('User')
      .select('*')
      .eq('id', id)
      .single<User>();

    if (error || !data) throw new NotFoundException('User not found');
    return data;
  }

  async findByEmail(email: string): Promise<User | null> {
    const { data } = await this.supabase
      .getClient()
      .from('User')
      .select('*')
      .eq('email', email)
      .single<User>();

    return data;
  }
}
