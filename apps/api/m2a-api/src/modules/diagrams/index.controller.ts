import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DiagramsService } from './index.service';
import type { UpdateDiagramDto } from './index.schema';
import { CurrentUser } from '../auth/index.decorator';
import { AuthGuard } from '../auth/index.guard';

@Controller('diagrams')
export class DiagramsController {
  constructor(private readonly diagramsService: DiagramsService) {}

  @Get()
  async findAll(@Req() req: any) {
    const userId = req.user.sub;
    return this.diagramsService.findAll(userId);
  }

  @Get('trash')
  @UseGuards(AuthGuard)
  getTrash(@CurrentUser() user: { sub: string }) {
    return this.diagramsService.getDeletedByUser(user.sub);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateData: UpdateDiagramDto,
    @Req() req: any,
  ) {
    const userId = req.user.sub;
    return this.diagramsService.update(id, userId, updateData);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async softDelete(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.sub;
    return this.diagramsService.softDelete(id, userId);
  }

  @Delete(':id/permanent')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  permanentDelete(@Param('id') id: string, @CurrentUser() user: { sub: string }) {
    return this.diagramsService.permanentDelete(id, user.sub);
  }
}
