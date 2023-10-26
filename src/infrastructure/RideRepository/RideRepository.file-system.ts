import * as fs from 'fs';

import { RideRepository } from '@/application/repositories/RideRepository';
import { RideData } from '@/domain/Ride';
import { User } from '@/domain/User';

export class FileSystemRideRepository implements RideRepository {
  constructor(private readonly rideFile: string) {}

  async postRide(rideToSave: RideData): Promise<void> {
    const allRides = await this.readAllRidesFromFile();

    allRides.push(rideToSave);

    return fs.promises.writeFile(this.rideFile, JSON.stringify(allRides));
  }

  async getRidesPostedByDriver(userId: string): Promise<RideData[]> {
    const allRides = await this.readAllRidesFromFile();

    return allRides.filter(ride => ride.driver.id === userId);
  }

  async getRidesBookedByPassenger(userId: string): Promise<RideData[]> {
    const allRides = await this.readAllRidesFromFile();

    const bookedRides = allRides.filter(ride =>
      ride.passengers.some(passenger => passenger.id === userId)
    );

    return bookedRides;
  }

  async bookRide(params: { user: User; ride: RideData }): Promise<void> {
    const allRides = await this.readAllRidesFromFile();

    const updatedRides = allRides.map(ride => {
      if (ride.id === params.ride.id) {
        return {
          ...ride,
          passengers: [...ride.passengers, params.user],
        };
      }
      return ride;
    });

    return fs.promises.writeFile(this.rideFile, JSON.stringify(updatedRides));
  }

  private async readAllRidesFromFile(): Promise<RideData[]> {
    try {
      const buffer = await fs.promises.readFile(this.rideFile);

      const rideData = JSON.parse(buffer.toString()) as RideData[];

      return rideData;
    } catch (e) {
      return [];
    }
  }
}
