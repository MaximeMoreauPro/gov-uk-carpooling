import { RideData } from '@/domain/Ride';
import { GovUK_CarpoolingError, GovUK_CarpoolingErrorCode } from '@/GovUK_CarpoolingError';
import { StubDateProvider } from '@/infrastructure/DateProvider/DateProvider.stub';
import { InMemoryRideRepository } from '@/infrastructure/RideRepository/RideRepository.in-memory';
import { FakeIdProvider } from '@/infrastructure/IdProvider/IdProvider.fake';
import { Alex } from '@/infrastructure/tests/User.test-data';

import { PostRideCommand, PostRideUseCase } from './PostRide.use-case';

describe('Feature: post a ride', () => {
  let fixture: Fixture;

  beforeEach(() => {
    fixture = createFixture();
  });

  test('Alex can post a ride', async () => {
    fixture.givenNowIs('2023-01-01T08:00:00.000Z');

    await fixture.whenUserPostRide({
      driver: Alex,
      departurePlace: 'London',
      departureTime: '2023-01-01T12:30:00.000Z',
      destinationPlace: 'Brighton',
      destinationTime: '2023-01-01T14:30:00.000Z',
    });

    fixture.thenPostedRideShouldBe({
      id: fixture.getIdByIndex(0),
      driver: Alex,
      departurePlace: 'London',
      departureTime: '2023-01-01T12:30:00.000Z',
      destinationPlace: 'Brighton',
      destinationTime: '2023-01-01T14:30:00.000Z',
      postedAt: '2023-01-01T08:00:00.000Z',
      passengers: [],
    });
  });

  describe('Rule: the departure time must be before the destination time', () => {
    test('Alex cannot post a ride with the same departure and arrival time', async () => {
      fixture.givenNowIs('2023-01-01T08:00:00.000Z');

      await fixture.whenUserPostRide({
        driver: Alex,
        departurePlace: 'London',
        departureTime: '2023-01-01T12:30:00.000Z',
        destinationPlace: 'Brighton',
        destinationTime: '2023-01-01T12:30:00.000Z',
      });

      fixture.thenErrorShouldBe(
        'DepartureTimeAfterDestinationTimeError',
        'the departure time must be before the destination time'
      );
    });

    test('Alex cannot post a ride with the departure time after the arrival time', async () => {
      fixture.givenNowIs('2023-01-01T08:00:00.000Z');

      await fixture.whenUserPostRide({
        driver: Alex,
        departurePlace: 'London',
        departureTime: '2023-01-01T12:30:00.000Z',
        destinationPlace: 'Brighton',
        destinationTime: '2023-01-01T11:30:00.000Z',
      });

      fixture.thenErrorShouldBe(
        'DepartureTimeAfterDestinationTimeError',
        'the departure time must be before the destination time'
      );
    });
  });

  describe('Rule: the departure time must be in the future', () => {
    test('Alex cannot post a ride with the departure time in the past', async () => {
      fixture.givenNowIs('2023-01-01T08:00:00.000Z');

      await fixture.whenUserPostRide({
        driver: Alex,
        departurePlace: 'London',
        departureTime: '2023-01-01T07:30:00.000Z',
        destinationPlace: 'Brighton',
        destinationTime: '2023-01-01T11:30:00.000Z',
      });

      fixture.thenErrorShouldBe(
        'PassedDepartureTimeError',
        'the departure time must be in the future'
      );
    });

    test('Alex cannot post a ride with the departure time set at the current time', async () => {
      fixture.givenNowIs('2023-01-01T08:00:00.000Z');

      await fixture.whenUserPostRide({
        driver: Alex,
        departurePlace: 'London',
        departureTime: '2023-01-01T08:00:00.000Z',
        destinationPlace: 'Brighton',
        destinationTime: '2023-01-01T11:30:00.000Z',
      });

      fixture.thenErrorShouldBe(
        'PassedDepartureTimeError',
        'the departure time must be in the future'
      );
    });
  });

  describe('Rule: the place must not be empty', () => {
    test('Alex cannot post a ride with an empty departure place', async () => {
      fixture.givenNowIs('2023-01-01T08:00:00.000Z');

      await fixture.whenUserPostRide({
        driver: Alex,
        departurePlace: '   ',
        departureTime: '2023-01-01T12:30:00.000Z',
        destinationPlace: 'Brighton',
        destinationTime: '2023-01-01T14:30:00.000Z',
      });

      fixture.thenErrorShouldBe(
        'EmptyPlaceError',
        'the place must not be empty'
      );
    });

    test('Alex cannot post a ride with an empty destination place', async () => {
      fixture.givenNowIs('2023-01-01T08:00:00.000Z');

      await fixture.whenUserPostRide({
        driver: Alex,
        departurePlace: 'London',
        departureTime: '2023-01-01T12:30:00.000Z',
        destinationPlace: '   ',
        destinationTime: '2023-01-01T14:30:00.000Z',
      });

      fixture.thenErrorShouldBe(
        'EmptyPlaceError',
        'the place must not be empty'
      );
    });
  });

  describe('Rule: the departure and destination places must be different', () => {
    test('Alex cannot post a ride the same departure and destination place', async () => {
      fixture.givenNowIs('2023-01-01T08:00:00.000Z');

      await fixture.whenUserPostRide({
        driver: Alex,
        departurePlace: 'London',
        departureTime: '2023-01-01T12:30:00.000Z',
        destinationPlace: 'London',
        destinationTime: '2023-01-01T14:30:00.000Z',
      });

      fixture.thenErrorShouldBe(
        'SameDepartureAndDestinationPlaceError',
        'the departure and destination places must be different'
      );
    });
  });
});

type Fixture = ReturnType<typeof createFixture>;

const createFixture = () => {
  const dateProvider = new StubDateProvider();
  const rideRepository = new InMemoryRideRepository();
  const idProvider = new FakeIdProvider();
  const postRideUseCase = new PostRideUseCase(
    rideRepository,
    dateProvider,
    idProvider
  );
  let thrownError: unknown;

  return {
    givenNowIs(datetime: string) {
      dateProvider.setNow(datetime);
    },
    async whenUserPostRide(postRideCommand: PostRideCommand) {
      try {
        await postRideUseCase.handle(postRideCommand);
      } catch (e) {
        thrownError = e;
      }
    },
    thenPostedRideShouldBe(expectedRide: RideData) {
      expect(expectedRide).toEqual(rideRepository.rides[0]);
    },
    thenErrorShouldBe(
      expectedErrorCode: GovUK_CarpoolingErrorCode,
      expectedErrorMessage: string
    ) {
      expect(thrownError).toBeInstanceOf(GovUK_CarpoolingError);
      expect((thrownError as GovUK_CarpoolingError).code).toBe(expectedErrorCode);
      expect((thrownError as GovUK_CarpoolingError).message).toBe(expectedErrorMessage);
    },
    getIdByIndex(index: number): string {
      return idProvider.getIdByIndex(index);
    },
  };
};
