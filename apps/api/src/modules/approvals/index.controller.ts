import { Controller, Get, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApprovalsService } from './index.service';
import { respondApprovalSchema } from './index.schema';
import { AuthGuard } from '../auth/index.guard';
import { CurrentUser } from '../auth/index.decorator';

@Controller('approvals')
@UseGuards(AuthGuard)
export class ApprovalsController {
  constructor(private readonly approvals: ApprovalsService) {}

  @Get('team/:teamId')
  getTeamRequests(
    @Param('teamId') teamId: string,
    @CurrentUser() user: { sub: string },
  ) {
    return this.approvals.getTeamRequests(teamId, user.sub);
  }

  @Get('diagram/:diagramId')
  getPendingByDiagram(@Param('diagramId') diagramId: string) {
    return this.approvals.getPendingByDiagram(diagramId);
  }

  @Patch(':id/respond')
  respondRequest(
    @Param('id') id: string,
    @Body() body: unknown,
    @CurrentUser() user: { sub: string },
  ) {
    const dto = respondApprovalSchema.parse(body);
    return this.approvals.respondRequest(id, user.sub, dto.approve);
  }
}
