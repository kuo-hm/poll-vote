import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class CaptureIpGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const xForwardedFor = request.headers['x-forwarded-for'] as
      | string
      | undefined;
    const realIp = request.headers['x-real-ip'] as string | undefined;
    const remoteAddr = request.socket?.remoteAddress;

    // Pick the first valid IP
    let ip: string | undefined =
      xForwardedFor?.split(',')[0].trim() || realIp || remoteAddr;

    // Normalize IPv6 localhost (::ffff:127.0.0.1 → 127.0.0.1)
    if (ip?.startsWith('::ffff:')) {
      ip = ip.substring(7);
    }

    // Attach to request for later use
    request.clientIp = ip || '127.0.0.1';

    return true; // don’t block, just capture
  }
}
