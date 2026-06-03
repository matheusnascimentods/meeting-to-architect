import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/index.service';

@Injectable()
export class TrashRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findDeletedByUser(userId: string) {
    return this.prisma.diagram.findMany({
      where: {
        createdBy: userId,
        isDeleted: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  async findById(id: string) {
    return this.prisma.diagram.findUnique({
      where: { id },
    });
  }

  async restore(id: string) {
    return this.prisma.diagram.update({
      where: { id },
      data: { isDeleted: false },
    });
  }

  async permanentDelete(id: string) {
    return this.prisma.diagram.delete({
      where: { id },
    });
  }
}
