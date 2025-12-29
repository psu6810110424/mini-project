import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  ignoreExpiration: false,
  // ใช้ || เพื่อใส่ค่าสำรอง หรือใช้ ! เพื่อยืนยันว่าไม่เป็นค่าว่าง
  secretOrKey: configService.get<string>('JWT_SECRET') || 'fallbackSecret', 
    });
  }

  async validate(payload: any) {
    // ข้อมูลใน payload จะถูกแนบไปกับ request.user อัตโนมัติ
    return { userId: payload.sub, username: payload.username, role: payload.role };
  }
}
