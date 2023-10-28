import { RideData } from '@/domain/Ride';
import { User } from '@/domain/User';
import { RideRepository } from '@/application/repositories/RideRepository';
import { UserRepository } from '@/application/repositories/UserRepository';

export type ViewUserRidesQuery =
  | {
      userId: User['id'];
    }
  | {
      userEmail: User['email'];
    };

export class ViewUserRidesUseCase {
  constructor(
    private readonly rideRepository: RideRepository,
    private readonly userRepositoyy: UserRepository
  ) {}

  async handle(
    viewUserRidesQuery: ViewUserRidesQuery
  ): Promise<RideData[] | { message: string }> {
    try {
      const user =
        'userId' in viewUserRidesQuery
          ? await this.userRepositoyy.getUser(viewUserRidesQuery.userId)
          : await this.userRepositoyy.getUserByEmail(
              viewUserRidesQuery.userEmail
            );

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
          message: `The user with ${viewUserRidesQuery} email does not exist!`,
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
