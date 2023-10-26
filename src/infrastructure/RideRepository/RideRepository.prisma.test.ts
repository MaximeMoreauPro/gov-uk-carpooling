import { exec } from 'child_process';
import { promisify } from 'util';

import { PrismaClient } from '@prisma/client';
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from 'testcontainers';

import { PrismaUserRepository } from '@/infrastructure/UserRepository/UserRepository.prisma';
import { Alex, Zoe } from '@/infrastructure/tests/User.test-data';

import { PrismaRideRepository } from './RideRepository.prisma';

const asyncExec = promisify(exec);

describe('PrismaRideRepository', () => {
  let container: StartedPostgreSqlContainer;
  let prismaClient: PrismaClient;
  beforeAll(async () => {
    const database = 'gov-uk-carpooling-test';
    const username = 'test-user';
    const password = 'test';
    container = await new PostgreSqlContainer('postgres:15.3')
      .withDatabase(database)
      .withUsername(username)
      .withPassword(password)
      .withExposedPorts(5432)
      .start();

    const databaseUrl = `postgresql://${username}:${password}@${container.getHost()}:${container.getMappedPort(
      5432
    )}/${database}`;

    prismaClient = new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    });
    await asyncExec(`DATABASE_URL=${databaseUrl} npx prisma migrate deploy`);

    return prismaClient.$connect();
  }, 1000 * 30);

  afterAll(async () => {
    await container.stop({ timeout: 1000 });
    return prismaClient.$disconnect();
  });

  beforeEach(async () => {
    await prismaClient.ride.deleteMany();

    return prismaClient.user.deleteMany();
  });

  test('save a Ride', async () => {
    const userRepository = new PrismaUserRepository(prismaClient);

    await userRepository.save(Alex);
    await userRepository.save(Zoe);

    const rideRepository = new PrismaRideRepository(prismaClient);
    await rideRepository.postRide({
      id: '1',
      driver: Alex,
      departurePlace: 'London',
      departureTime: '2023-01-01T12:30:00.000Z',
      destinationPlace: 'Brighton',
      destinationTime: '2023-01-01T14:30:00.000Z',
      postedAt: '2023-01-01T04:30:00.000Z',
      passengers: [],
    });
    await rideRepository.postRide({
      id: '2',
      driver: Zoe,
      departurePlace: 'Liverpool',
      departureTime: '2023-01-01T12:30:00.000Z',
      destinationPlace: 'Manchester',
      destinationTime: '2023-01-01T14:30:00.000Z',
      postedAt: '2023-01-01T04:30:00.000Z',
      passengers: [],
    });

    const rides = await rideRepository.getRidesPostedByDriver('1');

    expect(rides).toStrictEqual([
      {
        id: '1',
        driver: Alex,
        departurePlace: 'London',
        departureTime: '2023-01-01T12:30:00.000Z',
        destinationPlace: 'Brighton',
        destinationTime: '2023-01-01T14:30:00.000Z',
        postedAt: '2023-01-01T04:30:00.000Z',
        passengers: [],
      },
    ]);
  });

  test('book a Ride', async () => {
    const userRepository = new PrismaUserRepository(prismaClient);

    await userRepository.save(Alex);

    await userRepository.save(Zoe);

    const rideRepository = new PrismaRideRepository(prismaClient);
    await rideRepository.postRide({
      id: '1',
      driver: Alex,
      departurePlace: 'London',
      departureTime: '2023-01-01T12:30:00.000Z',
      destinationPlace: 'Brighton',
      destinationTime: '2023-01-01T14:30:00.000Z',
      postedAt: '2023-01-01T04:30:00.000Z',
      passengers: [],
    });

    await rideRepository.bookRide({
      user: Zoe,
      ride: {
        id: '1',
        driver: Alex,
        departurePlace: 'London',
        departureTime: '2023-01-01T12:30:00.000Z',
        destinationPlace: 'Brighton',
        destinationTime: '2023-01-01T14:30:00.000Z',
        postedAt: '2023-01-01T04:30:00.000Z',
        passengers: [],
      },
    });

    const rides = await rideRepository.getRidesBookedByPassenger('2');

    expect(rides).toStrictEqual([
      {
        id: '1',
        driver: Alex,
        departurePlace: 'London',
        departureTime: '2023-01-01T12:30:00.000Z',
        destinationPlace: 'Brighton',
        destinationTime: '2023-01-01T14:30:00.000Z',
        postedAt: '2023-01-01T04:30:00.000Z',
        passengers: [Zoe],
      },
    ]);
  });
});
