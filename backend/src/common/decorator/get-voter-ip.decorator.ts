import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetVoterIp = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    const ip =
      request.headers['x-forwarded-for'] || request.socket.remoteAddress;
    return ip?.toString() || '';
  },
);
