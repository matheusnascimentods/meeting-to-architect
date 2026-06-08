import { Body, Controller, Delete, Get, Param, Post, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { TeamDiagramsService } from './index.service';
import { addToTeamSchema } from './index.schema';
import { AuthGuard } from '../auth/index.guard';
import { CurrentUser } from '../auth/index.decorator';

@Controller('team-diagrams')
@UseGuards(AuthGuard)
export class TeamDiagramsController {
  constructor(private readonly teamDiagramsService: TeamDiagramsService) {}

  @Get('team/:teamId')
  findByTeam(
    @Param('teamId', ParseUUIDPipe) teamId: string,
    @CurrentUser() user: { sub: string },
  ) {
    return this.teamDiagramsService.findByTeam(teamId, user.sub);
  }

  @Post(':id/add-to-team')
  addToTeam(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: unknown,
    @CurrentUser() user: { sub: string },
  ) {
    const dto = addToTeamSchema.parse(body);
    return this.teamDiagramsService.addToTeam(id, dto.team_id, user.sub);
  }
  @Delete(':id/remove-from-team')
  removeFromTeam(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: { sub: string },
  ) {
    return this.teamDiagramsService.removeFromTeam(id, user.sub);
  }
}
