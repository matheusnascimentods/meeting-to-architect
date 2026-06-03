import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MembersService } from './index.service';
import { AuthGuard } from '../auth/index.guard';
import { CurrentUser } from '../auth/index.decorator';

@Controller('members')
@UseGuards(AuthGuard)
export class MembersController {
  constructor(private readonly members: MembersService) {}

  @Get('team/:teamId')
  getMembers(
    @Param('teamId') teamId: string,
    @CurrentUser() user: { sub: string },
  ) {
    return this.members.getMembers(teamId, user.sub);
  }

  @Patch('team/:teamId/user/:userId/role')
  updateMemberRole(
    @Param('teamId') teamId: string,
    @Param('userId') userId: string,
    @Body('role') role: 'admin' | 'member' | 'maintainer',
    @CurrentUser() user: { sub: string },
  ) {
    return this.members.updateMemberRole(teamId, user.sub, userId, role);
  }

  @Delete('team/:teamId/user/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeMember(
    @Param('teamId') teamId: string,
    @Param('userId') userId: string,
    @CurrentUser() user: { sub: string },
  ) {
    return this.members.removeMember(teamId, user.sub, userId);
  }
}
