import { PrismaClient } from '@prisma/client';

import { RideRepository } from '@/application/repositories/RideRepository';
import { RideData } from '@/domain/Ride';
import { User } from '@/domain/User';

export class PrismaRideRepository implements RideRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async postRide({
    id,
    departurePlace,
    departureTime,
    destinationPlace,
    destinationTime,
    postedAt,
    driver: { id: driverId },
  }: RideData): Promise<void> {
    await this.prisma.ride.create({
      data: {
        id,
        departurePlace,
        departureTime,
        destinationPlace,
        destinationTime,
        postedAt,
        driverId,
      },
    });
  }

  async getRidesPostedByDriver(userId: string): Promise<RideData[]> {
    const userRides = await this.prisma.ride.findMany({
      where: { driverId: userId },
      select: {
        id: true,
        departurePlace: true,
        departureTime: true,
        destinationPlace: true,
        destinationTime: true,
        driver: true,
        postedAt: true,
        passengers: true,
      },
    });

    return userRides;
  }

  async getRidesBookedByPassenger(userId: string): Promise<RideData[]> {
    const userRides = await this.prisma.ride.findMany({
      where: { passengers: { some: { id: userId } } },
      select: {
        id: true,
        departurePlace: true,
        departureTime: true,
        destinationPlace: true,
        destinationTime: true,
        driver: true,
        postedAt: true,
        passengers: true,
      },
    });

    return userRides;
  }

  async bookRide({
    user,
    ride,
  }: {
    user: User;
    ride: RideData;
  }): Promise<void> {
    await this.prisma.ride.update({
      where: { id: ride.id },
      data: { passengers: { connect: { id: user.id } } },
    });
  }
}
