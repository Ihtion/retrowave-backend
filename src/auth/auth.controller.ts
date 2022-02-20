import { AuthGuard } from '@nestjs/passport';
import { Controller, Request, Post, UseGuards } from '@nestjs/common';

@Controller()
export class AuthController {
  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  async login(@Request() req) {
    return req.user;
  }
}
