import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TrashRepository } from './index.repository';

@Injectable()
export class TrashService {
  constructor(private readonly repository: TrashRepository) {}

  async getDeletedByUser(userId: string) {
    try {
      return await this.repository.findDeletedByUser(userId);
    } catch (error) {
      throw new Error(`Failed to fetch trash: ${error.message}`);
    }
  }

  async restore(id: string, userId: string): Promise<void> {
    const data = await this.repository.findById(id);

    if (!data)
      throw new NotFoundException('Diagram not found');
    if (data.createdBy !== userId)
      throw new ForbiddenException(
        'No permission to restore this diagram',
      );

    try {
      await this.repository.restore(id);
    } catch (error) {
      throw new Error(`Failed to restore diagram: ${error.message}`);
    }
  }

  async permanentDelete(id: string, userId: string): Promise<void> {
    const data = await this.repository.findById(id);

    if (!data)
      throw new NotFoundException('Diagram not found');
    if (data.createdBy !== userId)
      throw new ForbiddenException('No permission to delete this diagram');

    try {
      await this.repository.permanentDelete(id);
    } catch (error) {
      throw new Error(`Failed to permanently delete: ${error.message}`);
    }
  }
}
