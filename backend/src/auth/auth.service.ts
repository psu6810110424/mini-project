import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService, 
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { username, password, role } = registerDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    return this.usersService.create({
      username,
      password: hashedPassword,
      role: role || 'USER',
    });
  }

  async login(username: string, pass: string) {
  const user = await this.usersService.findOneByUsername(username);
  
  if (user && (await bcrypt.compare(pass, user.password))) {
    console.log("User ID during login:", user.id); 

    
  const payload = { 
  username: user.username, 
  sub: Number(user.id), 
  role: user.role 
};
    
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user.id, username: user.username, role: user.role } 
    };
  }
  throw new UnauthorizedException('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
}
}