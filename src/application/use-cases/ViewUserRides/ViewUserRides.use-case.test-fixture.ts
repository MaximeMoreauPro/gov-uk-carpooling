import { Ride, RideData } from '@/domain/Ride';
import { User } from '@/domain/User';
import { InMemoryRideRepository } from '@/infrastructure/RideRepository/RideRepository.in-memory';
import { InMemoryUserRepository } from '@/infrastructure/UserRepository/UserRepository.in-memory';

import {
  ViewUserRidesUseCase,
  ViewUserRidesQuery,
} from './ViewUserRides.use-case';

export type Fixture = ReturnType<typeof createFixture>;

type CreateFixtureParams = {
  rideRepository?: InMemoryRideRepository;
  userRepository?: InMemoryUserRepository;
};

export const createFixture = ({
  rideRepository = new InMemoryRideRepository(),
  userRepository = new InMemoryUserRepository(),
}: CreateFixtureParams = {}) => {
  const viewUserRidesUseCase = new ViewUserRidesUseCase(
    rideRepository,
    userRepository
  );
  let userRides: RideData[];
  let message: string;

  return {
    async givenTheseUsersExist(existingUsers: User[]) {
      userRepository.givenTheseUsersExist(existingUsers);
    },
    async givenTheseRidesExist(existingRides: RideData[]) {
      rideRepository.givenTheseRidesExist(existingRides);
    },
    async whenViewUserRides(viewUserRidesQuery: ViewUserRidesQuery) {
      const viewUserRidesQueryResult = await viewUserRidesUseCase.handle(
        viewUserRidesQuery
      );
      if (viewUserRidesQueryResult instanceof Array) {
        userRides = viewUserRidesQueryResult;
      } else {
        message = viewUserRidesQueryResult.message;
      }
    },
    thenDisplayedRidesShouldBe(expectedRides: RideData[]) {
      expect(userRides).toEqual(expectedRides);
    },
    thenDisplayedMessageShouldBe(expectedMessage: string) {
      expect(message).toEqual(expectedMessage);
    },
  };
};

export class ErrorInMemoryRideRepository extends InMemoryRideRepository {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getRidesPostedByDriver(user: string): Promise<Ride[]> {
    throw new Error('getRidesByUser error for testing purpose');
  }
}
