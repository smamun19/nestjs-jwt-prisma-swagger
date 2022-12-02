import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/utils/jwt/jwt-auth.guard';

@Controller('user')
@ApiTags('USER')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('jwt')
export class UserController {
  @Post()
  myInfo() {
    return 'Working';
  }
}
