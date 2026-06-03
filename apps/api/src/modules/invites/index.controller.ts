import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { InvitesService } from './index.service';
import { inviteMemberSchema, respondInviteSchema } from './index.schema';
import { AuthGuard } from '../auth/index.guard';
import { CurrentUser } from '../auth/index.decorator';

@Controller('invites')
@UseGuards(AuthGuard)
export class InvitesController {
  constructor(private readonly invites: InvitesService) {}

  @Get('me')
  getMyInvites(@CurrentUser() user: { sub: string }) {
    return this.invites.getMyInvites(user.sub);
  }

  @Post('team/:teamId')
  invite(
    @Param('teamId') teamId: string,
    @Body() body: unknown,
    @CurrentUser() user: { sub: string },
  ) {
    const dto = inviteMemberSchema.parse(body);
    return this.invites.inviteMember(teamId, dto.email, user.sub);
  }

  @Patch(':id/respond')
  respondInvite(
    @Param('id') id: string,
    @Body() body: unknown,
    @CurrentUser() user: { sub: string },
  ) {
    const dto = respondInviteSchema.parse(body);
    return this.invites.respondInvite(id, user.sub, dto.accept);
  }
}
