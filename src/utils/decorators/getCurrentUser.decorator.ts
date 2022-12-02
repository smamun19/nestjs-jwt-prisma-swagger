import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload, RtUserPayload } from 'src/types';

export const GetCurrentUser = createParamDecorator(
  (
    data: keyof JwtPayload | keyof RtUserPayload | undefined,
    context: ExecutionContext,
  ) => {
    const request = context.switchToHttp().getRequest();
    if (!data) return request.user;
    return request.user;
  },
);
