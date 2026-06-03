import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/index.service';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto, UpdateUserDto, User } from './index.schema';
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
      .from('Users')
      .insert([
        {
          email,
          password_hash: hash,
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
      .from('Users')
      .select('*')
      .eq('id', id)
      .single<User>();

    if (error || !data) throw new NotFoundException('User not found');
    return data;
  }

  async findByEmail(email: string): Promise<User | null> {
    const { data } = await this.supabase
      .getClient()
      .from('Users')
      .select('*')
      .eq('email', email)
      .single<User>();

    return data;
  }

  async delete(id: string, requesterId: string): Promise<void> {
    if (id !== requesterId)
      throw new ForbiddenException('You do not have permission to delete this user');

    const { error } = await this.supabase
      .getClient()
      .from('Users')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw new Error(`Failed to deactivate user: ${error.message}`);
  }

  async update(
    id: string,
    requesterId: string,
    dto: UpdateUserDto,
  ): Promise<void> {
    if (id !== requesterId)
      throw new ForbiddenException('You do not have permission to update this user');

    const { error } = await this.supabase
      .getClient()
      .from('Users')
      .update({ ...dto, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw new Error(`Failed to update user: ${error.message}`);
  }

  async changePassword(
    id: string,
    requesterId: string,
    dto: ChangePasswordDto,
  ): Promise<void> {
    if (id !== requesterId)
      throw new ForbiddenException(
        'You do not have permission to change this user password',
      );

    const { data, error: findError } = await this.supabase
      .getClient()
      .from('Users')
      .select('password_hash')
      .eq('id', id)
      .single();

    if (findError || !data)
      throw new NotFoundException('User not found');

    const isMatch = await bcrypt.compare(
      dto.currentPassword,
      data.password_hash,
    );
    if (!isMatch) throw new UnauthorizedException('Incorrect current password');

    const newHash = await bcrypt.hash(dto.newPassword, 10);

    const { error } = await this.supabase
      .getClient()
      .from('Users')
      .update({ password_hash: newHash, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw new Error(`Failed to change password: ${error.message}`);
  }
}
