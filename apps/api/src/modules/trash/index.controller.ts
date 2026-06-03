import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { TrashService } from './index.service';
import { AuthGuard } from '../auth/index.guard';
import { CurrentUser } from '../auth/index.decorator';

@Controller('trash')
@UseGuards(AuthGuard)
export class TrashController {
  constructor(private readonly trashService: TrashService) {}

  @Get()
  getTrash(@CurrentUser() user: { sub: string }) {
    return this.trashService.getDeletedByUser(user.sub);
  }

  @Patch(':id/restore')
  @HttpCode(HttpStatus.NO_CONTENT)
  restore(@Param('id') id: string, @CurrentUser() user: { sub: string }) {
    return this.trashService.restore(id, user.sub);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  permanentDelete(
    @Param('id') id: string,
    @CurrentUser() user: { sub: string },
  ) {
    return this.trashService.permanentDelete(id, user.sub);
  }
}
