import { Controller, Body, Post, HttpCode, HttpStatus} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() signUpDto: any) {
    return this.authService.register(
      signUpDto.username,
      signUpDto.password,
      signUpDto.role,
    );
  }
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() signInDto: any) {
    return this.authService.login(signInDto.username, signInDto.password);
  }
}
