import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/index.service';

@Injectable()
export class AgentsRepository {
  constructor(private readonly prisma: PrismaService) {}
}
