import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { RtStrategy } from 'src/utils/jwt/rt.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, RtStrategy],
})
export class AuthModule {}
