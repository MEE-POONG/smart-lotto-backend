import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

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
