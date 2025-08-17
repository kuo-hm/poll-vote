import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class RequireXForwardedForGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const xForwardedFor = request.headers['x-forwarded-for'];

    if (!xForwardedFor) {
      throw new BadRequestException('Missing x-forwarded-for header');
    }

    return true;
  }
}
