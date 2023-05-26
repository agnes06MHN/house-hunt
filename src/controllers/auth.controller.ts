import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthDto } from 'src/dtos/auth/auth.dto';
import { AuthService } from 'src/services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('sign_in')
  logIn(@Body() authLogInDto: AuthDto) {
    return this.authService.logIn(authLogInDto);
  }

  @Post('register')
  register(@Body() authRegisterDto: AuthDto) {
    return this.authService.register(authRegisterDto);
  }
}
