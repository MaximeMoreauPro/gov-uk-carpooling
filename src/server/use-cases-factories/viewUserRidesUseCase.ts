import { ViewUserRidesUseCase } from '@/application/use-cases/ViewUserRides/ViewUserRides.use-case';
import prisma from '@/infrastructure/prisma';
import { PrismaRideRepository } from '@/infrastructure/RideRepository/RideRepository.prisma';
import { PrismaUserRepository } from '@/infrastructure/UserRepository/UserRepository.prisma';

export function viewUserRidesUseCase(): ViewUserRidesUseCase {
  const rideRepository = new PrismaRideRepository(prisma);
  const userRepository = new PrismaUserRepository(prisma);

  return new ViewUserRidesUseCase(rideRepository, userRepository);
}
