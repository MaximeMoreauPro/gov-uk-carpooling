import { RideData } from '@/domain/Ride';
import { User } from '@/domain/User';
import { RideRepository } from '@/application/repositories/RideRepository';

export type BookRideCommand = {
  user: User;
  ride: RideData;
};

export class BookRideUseCase {
  constructor(private readonly rideRepository: RideRepository) {}

  async handle({ user, ride }: BookRideCommand): Promise<void> {
    await this.rideRepository.bookRide({ user, ride });
  }
}
