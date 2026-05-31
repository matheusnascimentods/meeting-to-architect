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
} from '@nestjs/common';
import { DiagramsService } from './index.service';
import type { UpdateDiagramDto } from './index.schema';

@Controller('diagrams')
export class DiagramsController {
  constructor(private readonly diagramsService: DiagramsService) {}

  @Get()
  async findAll(@Req() req: any) {
    const userId = req.user.sub;
    return this.diagramsService.findAll(userId);
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
}
