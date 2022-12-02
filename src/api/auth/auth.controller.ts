import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RtUserPayload } from 'src/types';
import { GetCurrentUser } from 'src/utils/decorators/getCurrentUser.decorator';
import { RefreshTokenGuard } from 'src/utils/jwt/rt-auth.guard';
import { AuthService } from './auth.service';
import { SigninInput, SignupInput } from './types.dto';

@Controller('auth')
@ApiTags('AUTH')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() body: SignupInput) {
    return this.authService.signup(body);
  }

  @Post('signin')
  signin(@Body() body: SigninInput) {
    return this.authService.signin(body);
  }

  @Get('refresh-tokens')
  @UseGuards(RefreshTokenGuard)
  @ApiBearerAuth('jwt')
  getRefreshedTokens(@GetCurrentUser() user: RtUserPayload) {
    const { id, refreshToken } = user;
    return this.authService.getRefreshedTokens(id, refreshToken);
  }
}
