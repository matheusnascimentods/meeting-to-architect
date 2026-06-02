import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { DiagramsService } from './index.service';
import { type UpdateDiagramDto, addToTeamSchema } from './index.schema';
import { CurrentUser } from '../auth/index.decorator';

@Controller('diagrams')
export class DiagramsController {
  constructor(private readonly diagramsService: DiagramsService) {}

  @Get()
  async findAll(@Req() req: any) {
    const userId = req.user.sub;
    return this.diagramsService.findAll(userId);
  }

  @Get('trash')
  getTrash(@CurrentUser() user: { sub: string }) {
    return this.diagramsService.getDeletedByUser(user.sub);
  }

  @Post(':id/add-to-team')
  addToTeam(
    @Param('id') id: string,
    @Body() body: unknown,
    @CurrentUser() user: { sub: string },
  ) {
    const dto = addToTeamSchema.parse(body);
    return this.diagramsService.addToTeam(id, dto.team_id, user.sub);
  }

  @Get('team/:teamId/requests')
  getTeamRequests(
    @Param('teamId') teamId: string,
    @CurrentUser() user: { sub: string },
  ) {
    return this.diagramsService.getTeamRequests(teamId, user.sub);
  }

  @Patch('requests/:requestId/respond')
  respondRequest(
    @Param('requestId') requestId: string,
    @Body() body: { approve: boolean },
    @CurrentUser() user: { sub: string },
  ) {
    return this.diagramsService.respondRequest(requestId, user.sub, body.approve);
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

  @Patch(':id/restore')
  @HttpCode(HttpStatus.NO_CONTENT)
  restore(@Param('id') id: string, @CurrentUser() user: { sub: string }) {
    return this.diagramsService.restore(id, user.sub);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async softDelete(@Param('id') id: string, @Req() req: any) {
    const userId = req.user.sub;
    return this.diagramsService.softDelete(id, userId);
  }

  @Delete(':id/permanent')
  @HttpCode(HttpStatus.NO_CONTENT)
  permanentDelete(
    @Param('id') id: string,
    @CurrentUser() user: { sub: string },
  ) {
    return this.diagramsService.permanentDelete(id, user.sub);
  }

  @Get('team/:teamId')
  findByTeam(
    @Param('teamId') teamId: string,
    @CurrentUser() user: { sub: string },
  ) {
    return this.diagramsService.findByTeam(teamId, user.sub);
  }
}
