import { CreateUserUseCase } from '@/application/use-cases/CreateUser.use-case';
import prisma from '@/infrastructure/prisma';
import { UUIDv4IdProvider } from '@/infrastructure/IdProvider/IdProvider.uuidv4';
import { PrismaUserRepository } from '@/infrastructure/UserRepository/UserRepository.prisma';

export function createUserUseCase(): CreateUserUseCase {
  const userRepository = new PrismaUserRepository(prisma);
  const idProvider = new UUIDv4IdProvider();

  return new CreateUserUseCase(userRepository, idProvider);
}
