import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      console.warn('[JwtAuthGuard] No token in header');
      throw new UnauthorizedException('ไม่พบ Token ใน Header');
    }

    try {
      
      const payload: any = await this.jwtService.verifyAsync(token);
      console.log('[JwtAuthGuard] verifying token:', token?.slice(0, 20) + '...');
      console.log('[JwtAuthGuard] token payload:', payload);

      const user = {
        id: payload.sub ?? payload.id,
        username: payload.username,
        role: payload.role ?? payload.roles,
      };

      request['user'] = user;
    } catch (err) {
      console.error('[JwtAuthGuard] token verify error:', err?.message || err);
      throw new UnauthorizedException('Token ไม่ถูกต้องหรือหมดอายุ');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}