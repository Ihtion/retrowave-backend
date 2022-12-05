import {
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  Body,
  HttpCode,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { GoogleLoginDto } from './dto/google-login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JWTPayload, LoginResponse } from './auth.interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req): Promise<LoginResponse> {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Request() req): Promise<JWTPayload> {
    return req.user;
  }

  @HttpCode(200)
  @Post('login-google')
  async loginGoogle(
    @Body() loginPayload: GoogleLoginDto,
  ): Promise<LoginResponse> {
    return this.authService.loginGoogle(loginPayload.credential);
  }
}
