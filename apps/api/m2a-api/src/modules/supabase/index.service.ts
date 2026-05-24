import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private client: SupabaseClient;

  constructor(private readonly config: ConfigService) {
    const url = this.config
      .get<string>('SUPABASE_URL')
      ?.replace(/\/$/, '')
      .replace('/rest/v1', '');
    const key = this.config.get<string>('SUPABASE_SERVICE_KEY');

    if (!url || !key) {
      throw new Error('SUPABASE_URL or SUPABASE_SERVICE_KEY is missing');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.client = createClient(url, key) as any;
  }

  getClient(): SupabaseClient {
    return this.client;
  }
}
