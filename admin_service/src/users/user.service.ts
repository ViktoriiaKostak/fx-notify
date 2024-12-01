import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findUserByEmailOrCreate(email: string) {
    try {
      let user = await this.prisma.user.findUnique({ where: { email } });
      if (!user) {
        user = await this.prisma.user.create({ data: { email } });
      }
      return user;
    } catch (error) {
      console.error('Error in findUserByEmailOrCreate:', error);
      throw new Error(`Failed to find or create user: ${error.message}`);
    }
  }
}
