import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET') || 'defaultSecret'; 
    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, 
      secretOrKey: secret, 
    });
  }

  async validate(payload: any) {
    if (!payload.sub || !payload.username) {
      throw new UnauthorizedException('ข้อมูลใน Token ไม่ถูกต้อง');
    }

    return {
      id: Number(payload.sub), 
      username: payload.username,
      role: payload.role,
    };
  }
}