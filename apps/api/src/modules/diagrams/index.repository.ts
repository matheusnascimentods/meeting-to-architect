import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/index.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class DiagramsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByUser(userId: string) {
    return this.prisma.diagram.findMany({
      where: {
        createdBy: userId,
        isDeleted: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: string) {
    return this.prisma.diagram.findUnique({
      where: { id },
    });
  }

  async create(data: Prisma.DiagramCreateInput) {
    return this.prisma.diagram.create({
      data,
    });
  }

  async update(id: string, data: Prisma.DiagramUpdateInput) {
    return this.prisma.diagram.update({
      where: { id },
      data,
    });
  }

  async softDelete(id: string) {
    return this.prisma.diagram.update({
      where: { id },
      data: { isDeleted: true },
    });
  }

  async delete(id: string) {
    return this.prisma.diagram.delete({
      where: { id },
    });
  }
}
