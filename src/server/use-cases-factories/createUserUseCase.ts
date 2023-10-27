import { PrismaClient } from '@prisma/client';

import { CreateUserUseCase } from '@/application/use-cases/CreateUser.use-case';
import { UUIDv4IdProvider } from '@/infrastructure/IdProvider/IdProvider.uuidv4';
import { PrismaUserRepository } from '@/infrastructure/UserRepository/UserRepository.prisma';

export function createUserUseCase(): CreateUserUseCase {
  const prismaClient = new PrismaClient();
  const userRepository = new PrismaUserRepository(prismaClient);
  const idProvider = new UUIDv4IdProvider();

  return new CreateUserUseCase(userRepository, idProvider);
}
