import { Controller, Body, Post, HttpCode, HttpStatus} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {constructor(private authService: AuthService) {}

@Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
@HttpCode(HttpStatus.OK)
@Post('login')
  async login(@Body() signInDto: any) {
    return this.authService.login(signInDto.username, signInDto.password);
  }
}
