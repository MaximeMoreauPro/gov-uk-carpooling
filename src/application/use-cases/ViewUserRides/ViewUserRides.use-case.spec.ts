import { Alex, Bob, Zoe } from '@/infrastructure/tests/User.test-data';
import { rideBuilder } from '@/infrastructure/tests/Ride.builder';

import {
  ErrorInMemoryRideRepository,
  Fixture,
  createFixture,
} from './ViewUserRides.use-case.test-fixture';

describe('Feature: view user rides', () => {
  let fixture: Fixture;

  beforeEach(() => {
    fixture = createFixture();
  });

  describe('Rule: the rides are displayed by departure date and time in chronological order', () => {
    test("A user can view the 3 Alex's rides", async () => {
      const alexRide1 = rideBuilder().drivenBy(Alex).build();
      const alexRide2 = rideBuilder().drivenBy(Alex).build();
      const zoeRide = rideBuilder().drivenBy(Zoe).build();
      const bobRide = rideBuilder().drivenBy(Bob).build();

      fixture.givenTheseRidesExist([alexRide1, zoeRide, alexRide2, bobRide]);

      await fixture.whenViewUserRides({
        user: Alex,
      });

      fixture.thenDisplayedRidesShouldBe([alexRide1, alexRide2]);
    });
  });

  describe('Rule: the user is informed if a user has no ride', () => {
    test('Alex can view the message "Zoe Davies has no ride"', async () => {
      const alexRide = rideBuilder().drivenBy(Alex).build();
      const bobRide = rideBuilder().drivenBy(Bob).build();

      fixture.givenTheseRidesExist([alexRide, bobRide]);

      await fixture.whenViewUserRides({
        user: Zoe,
      });

      fixture.thenDisplayedMessageShouldBe(
        `${Zoe.firstName} ${Zoe.lastName} has no ride`
      );
    });
  });

  describe("Rule: the user is informed if the user's rides cannot be fetched", () => {
    test('Alex can view the message "Zoe Davies\'s rides cannot be fetched. Please try later"', async () => {
      fixture = createFixture({
        rideRepository: new ErrorInMemoryRideRepository(),
      });

      const zoeRide = rideBuilder().drivenBy(Zoe).build();

      fixture.givenTheseRidesExist([zoeRide]);

      await fixture.whenViewUserRides({
        user: Zoe,
      });

      fixture.thenDisplayedMessageShouldBe(
        `${Zoe.firstName} ${Zoe.lastName}'s rides cannot be fetched. Please try later`
      );
    });
  });
});
