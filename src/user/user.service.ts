import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}

  async getUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { user_email: email },
    });
  }

  async register(data: {
    user_name: string;
    user_email: string;
    password: string;
  }) {
    const existingUser = await this.prisma.user.findUnique({
      where: { user_email: data.user_email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await this.authService.hashPassword(data.password);

    return this.prisma.user.create({
      data: {
        user_name: data.user_name,
        user_email: data.user_email,
        password: hashedPassword,
      },
    });
  }
}
