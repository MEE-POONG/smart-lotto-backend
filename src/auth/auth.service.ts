import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  // Hash the password before saving to the database
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  // Validate user credentials
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { user_email: email },
    });

    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  // Generate a JWT token
  async generateAccessToken(user: any): Promise<string> {
    const payload = { userId: user.user_id, email: user.user_email };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  }

  // Login function
  async login(email: string, password: string): Promise<any> {
    const user = await this.validateUser(email, password);
    const token = await this.generateAccessToken(user);
    return { accessToken: token, user };
  }
}
