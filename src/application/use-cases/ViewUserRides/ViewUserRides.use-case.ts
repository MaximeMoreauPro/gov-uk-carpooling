import { RideData } from '@/domain/Ride';
import { RideRepository } from '@/application/repositories/RideRepository';
import { UserRepository } from '@/application/repositories/UserRepository';

export type ViewUserRidesQuery = {
  userIdOrEmail: string;
};

export class ViewUserRidesUseCase {
  constructor(
    private readonly rideRepository: RideRepository,
    private readonly userRepositoyy: UserRepository
  ) {}

  async handle({
    userIdOrEmail,
  }: ViewUserRidesQuery): Promise<RideData[] | { message: string }> {
    try {
      const user = userIdOrEmail.includes('@')
        ? await this.userRepositoyy.getUserByEmail(userIdOrEmail)
        : await this.userRepositoyy.getUser(userIdOrEmail);

      if (user) {
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

          return ridesSortedByDepartureTime;
        } catch (e) {
          return {
            message: `${user.firstName} ${user.lastName}'s rides cannot be fetched. Please try later`,
          };
        }
      } else {
        return {
          message: `The user with ${userIdOrEmail} id/email does not exist!`,
        };
      }
    } catch (e) {
      return {
        message: 'User cannot be fetched. Please try later',
      };
    }
  }

  private sortRidesByDepartureTime(rides: RideData[]): RideData[] {
    return rides.sort((a, b) => a.departureTime.localeCompare(b.departureTime));
  }
}
