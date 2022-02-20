import { Controller, Request, Post, UseGuards } from '@nestjs/common';

import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller()
export class AuthController {
  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return req.user;
  }
}
