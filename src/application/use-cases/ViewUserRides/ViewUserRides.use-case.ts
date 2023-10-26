import { RideData } from '@/domain/Ride';
import { User } from '@/domain/User';
import { RideRepository } from '@/application/repositories/RideRepository';

export type ViewUserRidesQuery = {
  user: User;
};

export class ViewUserRidesUseCase {
  constructor(private readonly rideRepository: RideRepository) {}

  async handle({
    user,
  }: ViewUserRidesQuery): Promise<RideData[] | { message: string }> {
    try {
      const userRides = await this.rideRepository.getRidesPostedByDriver(
        user.id
      );

      if (userRides.length === 0) {
        return {
          message: `${user.firstName} ${user.lastName} has no ride`,
        };
      }

      const ridesSortedByDepartureTime =
        this.sortRidesByDepartureTime(userRides);

      return Promise.resolve(ridesSortedByDepartureTime);
    } catch (e) {
      console.error(e);
      return {
        message: `${user.firstName} ${user.lastName}'s rides cannot be fetched. Please try later`,
      };
    }
  }

  private sortRidesByDepartureTime(rides: RideData[]): RideData[] {
    return rides.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
  }
}
