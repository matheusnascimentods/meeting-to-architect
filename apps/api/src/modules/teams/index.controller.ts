import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TeamsService } from './index.service';
import {
  createTeamSchema,
  updateTeamSchema,
  inviteMemberSchema,
  respondInviteSchema,
  CreateTeamDto,
  UpdateTeamDto,
  RespondInviteDto,
} from './index.schema';
import { AuthGuard } from '../auth/index.guard';
import { CurrentUser } from '../auth/index.decorator';

@Controller('teams')
@UseGuards(AuthGuard)
export class TeamsController {
  constructor(private readonly teams: TeamsService) {}

  @Post()
  create(@Body() body: unknown, @CurrentUser() user: { sub: string }) {
    const dto: CreateTeamDto = createTeamSchema.parse(body);
    return this.teams.create(dto, user.sub);
  }

  @Get('invites/me')
  getMyInvites(@CurrentUser() user: { sub: string }) {
    return this.teams.getMyInvites(user.sub);
  }

  @Post(':id/invite')
  invite(
    @Param('id') id: string,
    @Body() body: unknown,
    @CurrentUser() user: { sub: string },
  ) {
    const dto = inviteMemberSchema.parse(body);
    return this.teams.inviteMember(id, dto.email, user.sub);
  }

  @Patch('invites/:inviteId/respond')
  respondInvite(
    @Param('inviteId') inviteId: string,
    @Body() body: unknown,
    @CurrentUser() user: { sub: string },
  ) {
    const dto = respondInviteSchema.parse(body);
    return this.teams.respondInvite(inviteId, user.sub, dto.accept);
  }

  @Get()
  findAll(@CurrentUser() user: { sub: string }) {
    return this.teams.findAllByUser(user.sub);
  }

  @Get(':id')
  findById(@Param('id') id: string, @CurrentUser() user: { sub: string }) {
    return this.teams.findById(id, user.sub);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: unknown,
    @CurrentUser() user: { sub: string },
  ) {
    const dto: UpdateTeamDto = updateTeamSchema.parse(body);
    return this.teams.update(id, user.sub, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string, @CurrentUser() user: { sub: string }) {
    return this.teams.delete(id, user.sub);
  }
}
