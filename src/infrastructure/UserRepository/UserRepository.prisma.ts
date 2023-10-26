import { PrismaClient } from '@prisma/client';

import { UserRepository } from '@/application/repositories/UserRepository';
import { User } from '@/domain/User';

export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(userToSave: User): Promise<void> {
    await this.prisma.user.create({
      data: userToSave,
    });
  }

  async getUser(userId: string): Promise<User | undefined> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    return user || undefined;
  }

  async getUserByEmail(userEmail: string): Promise<User | undefined> {
    const user = await this.prisma.user.findUnique({
      where: {
        email: userEmail,
      },
    });
    return user || undefined;
  }
}
