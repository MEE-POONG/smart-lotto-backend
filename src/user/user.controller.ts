import {
  Controller,
  Post,
  Body,
  BadRequestException,
  UseGuards,
  Req,
  Get,
  Param,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req: any) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('email/:email')
  async getUserByEmail(@Param('email') email: string) {
    return this.userService.getUserByEmail(email);
  }

  @Post('register')
  async register(
    @Body('user_name') userName: string,
    @Body('user_email') userEmail: string,
    @Body('password') password: string,
  ) {
    if (!userName || !userEmail || !password) {
      throw new BadRequestException('All fields are required');
    }

    return this.userService.register({
      user_name: userName,
      user_email: userEmail,
      password,
    });
  }
}
