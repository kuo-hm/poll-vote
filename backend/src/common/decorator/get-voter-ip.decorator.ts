import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetVoterIp = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();

    let ip =
      request.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
      request.headers['x-real-ip'] ||
      request.socket?.remoteAddress ||
      '127.0.0.1';

    return ip;
  },
);
