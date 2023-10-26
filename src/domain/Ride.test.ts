import { Alex } from '../infrastructure/tests/User.test-data';
import { Ride } from './Ride';

describe('Rule: the datetime must be in ISO format', () => {
  test('with valid datetime', () => {
    expect(() =>
      Ride.fromData({
        id: '1',
        postedAt: '2023-01-01T10:30:00.000Z',
        driver: Alex,
        departurePlace: 'London',
        departureTime: '2023-01-01T12:30:00.000Z',
        destinationPlace: 'Brighton',
        destinationTime: '2023-01-01T14:30:00.000Z',
        passengers: [],
      })
    ).not.toThrow();
  });

  test('with invalid datetime', () => {
    expect(() =>
      Ride.fromData({
        id: '1',
        postedAt: '2023-01-01-08:00',
        driver: Alex,
        departurePlace: 'London',
        departureTime: '2023-01-01T12:30:00.000Z',
        destinationPlace: 'Brighton',
        destinationTime: '2023-01-01T14:30:00.000Z',
        passengers: [],
      })
    ).toThrow(
      /^the datetime must be in the ISO 8601 format YYYY-MM-DDTHH:mm:ss.sssZ$/
    );

    expect(() =>
      Ride.fromData({
        id: '1',
        postedAt: '2023-01-01T12:30:00.000Z',
        driver: Alex,
        departurePlace: 'London',
        departureTime: '2023-01-01-08:00',
        destinationPlace: 'Brighton',
        destinationTime: '2023-01-01T14:30:00.000Z',
        passengers: [],
      })
    ).toThrow(
      /^the datetime must be in the ISO 8601 format YYYY-MM-DDTHH:mm:ss.sssZ$/
    );

    expect(() =>
      Ride.fromData({
        id: '1',
        postedAt: '2023-01-01T12:30:00.000Z',
        driver: Alex,
        departurePlace: 'London',
        departureTime: '2023-01-01T12:30:00.000Z',
        destinationPlace: 'Brighton',
        destinationTime: '2023-01-01-08:00',
        passengers: [],
      })
    ).toThrow(
      /^the datetime must be in the ISO 8601 format YYYY-MM-DDTHH:mm:ss.sssZ$/
    );
  });
});
