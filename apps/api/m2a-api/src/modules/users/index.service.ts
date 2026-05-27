import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/index.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from './index.schema';

@Injectable()
export class UsersService {
  constructor(
    private readonly supabase: SupabaseService,
    private readonly jwtService: JwtService,
  ) { }

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

    const token = this.jwtService.sign({ sub: data.id, email: data.email });

    return {
      message: 'User was created successfully',
      token,
    };
  }

  async login(email: string, password: string) {
    const user = await this.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign({ sub: user.id, email: user.email });

    return {
      message: 'Login successful',
      token,
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
