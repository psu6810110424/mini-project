import { Controller, Body, Post, HttpCode, HttpStatus} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {constructor(private authService: AuthService) {}

// 1. Endpoint สำหรับสมัครสมาชิก
  @Post('register')
  async register(@Body() signUpDto: any) {
    // รับค่าจาก body: username, password, role
    return this.authService.register(
      signUpDto.username,
      signUpDto.password,
      signUpDto.role,
    );
  }
// 2. Endpoint สำหรับเข้าสู่ระบบ
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() signInDto: any) {
    // รับค่าจาก body: username, password
    return this.authService.login(signInDto.username, signInDto.password);
  }
}
