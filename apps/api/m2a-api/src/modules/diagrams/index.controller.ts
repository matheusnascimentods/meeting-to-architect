import { Controller, Get, Req } from '@nestjs/common';
import { DiagramsService } from './index.service';

@Controller('diagrams')
export class DiagramsController {
  constructor(private readonly diagramsService: DiagramsService) {}

  @Get()
  async findAll(@Req() req: any) {
    const userId = req.user.sub;
    return this.diagramsService.findAll(userId);
  }
}
