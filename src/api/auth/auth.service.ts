import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { PrismaService } from 'src/prisma/prisma.service';
import { hashPassword, comparePassword } from 'src/utils/hash';
import { JwtPayload, RtPayload } from 'src/types/index';
import { SigninInput, SignupInput } from './types.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(body: SignupInput) {
    const hash = await hashPassword(body.password);
    return this.prisma.user.create({ data: { ...body, password: hash } });
  }

  async signin(body: SigninInput) {
    const { createdAt, email, id, name, password, phone, roles, updatedAt } =
      await this.prisma.user.findUniqueOrThrow({
        where: { email: body.email },
      });

    const isMatched = await comparePassword(body.password, password);

    if (!isMatched) {
      return 'not matched';
    }
    const tokens = await this.getJwtTokens({
      createdAt,
      email,
      id,
      name,
      phone,
      roles,
      updatedAt,
    });

    await this.updateRefreshTokenDb(id, tokens.refresh_token);

    return { ...tokens };
  }

  async getRefreshedTokens(userId: string, refreshToken: string) {
    const {
      refreshToken: hashedToken,
      createdAt,
      email,
      id,
      name,
      phone,
      roles,
      updatedAt,
    } = await this.prisma.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
    });
    if (!hashedToken) throw new ForbiddenException('Access Denied');

    const rtMatches = await argon.verify(hashedToken, refreshToken);
    if (!rtMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getJwtTokens({
      createdAt,
      email,
      id,
      name,
      phone,
      roles,
      updatedAt,
    });
    await this.updateRefreshTokenDb(id, tokens.refresh_token);

    return { ...tokens };
  }

  async getJwtTokens({
    createdAt,
    email,
    id,
    name,
    phone,
    roles,
    updatedAt,
  }: JwtPayload) {
    const jwtPayload = { createdAt, email, id, name, phone, roles, updatedAt };
    const rtPayload: RtPayload = { id, roles };

    const [jwt, rt] = await Promise.all([
      this.jwt.signAsync(jwtPayload, {
        secret: this.config.get('JWT_SECRET'),
        expiresIn: '30m',
      }),
      this.jwt.signAsync(rtPayload, {
        secret: this.config.get('RT_SECRET'),
        expiresIn: '30d',
      }),
    ]);

    return {
      jwt_token: jwt,
      refresh_token: rt,
    };
  }

  async updateRefreshTokenDb(userId: string, refreshToken: string) {
    const hash = await argon.hash(refreshToken);
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken: hash,
      },
    });
  }
}
