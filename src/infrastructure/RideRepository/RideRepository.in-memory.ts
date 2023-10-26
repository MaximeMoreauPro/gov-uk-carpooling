import { RideData } from '@/domain/Ride';
import { RideRepository } from '@/application/repositories/RideRepository';
import { User } from '@/domain/User';

export class InMemoryRideRepository implements RideRepository {
  rides: RideData[] = [];

  async postRide(rideToSave: RideData): Promise<void> {
    this.rides.push(rideToSave);
    return Promise.resolve();
  }

  async getRidesPostedByDriver(userId: string): Promise<RideData[]> {
    const userRides = this.rides.filter(({ driver }) => driver.id === userId);
    return Promise.resolve(userRides);
  }

  async getRidesBookedByPassenger(userId: string): Promise<RideData[]> {
    const bookedRides = this.rides.filter(ride =>
      ride.passengers.some(passenger => passenger.id === userId)
    );
    return Promise.resolve(bookedRides);
  }

  bookRide(params: { user: User; ride: RideData }): Promise<void> {
    this.rides = this.rides.map(ride => {
      if (ride.id === params.ride.id) {
        return {
          ...ride,
          passengers: [...ride.passengers, params.user],
        };
      }
      return ride;
    });
    return Promise.resolve();
  }

  givenTheseRidesExist(exsitingRides: RideData[]): void {
    this.rides = exsitingRides;
  }
}
