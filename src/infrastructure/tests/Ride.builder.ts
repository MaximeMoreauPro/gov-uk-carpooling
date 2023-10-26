import { RideData } from '@/domain/Ride';
import { User } from '@/domain/User';

import { Alex } from './User.test-data';

export const rideBuilder = ({
  id = '1',
  driver = Alex,
  departurePlace = 'London',
  departureTime = '2023-01-01T12:30:00.000Z',
  destinationPlace = 'Manchester',
  destinationTime = '2023-01-01T14:30:00.000Z',
  postedAt = '2023-01-01T08:30:00.000Z',
  passengers = [],
}: Partial<RideData> = {}) => {
  const props = {
    id,
    driver,
    departurePlace,
    departureTime,
    destinationPlace,
    destinationTime,
    postedAt,
    passengers,
  };

  return {
    withId(_id: string) {
      return rideBuilder({
        ...props,
        id: _id,
      });
    },
    drivenBy(_driver: User) {
      return rideBuilder({
        ...props,
        driver: _driver,
      });
    },
    withDeparturePlace(_departurePlace: string) {
      return rideBuilder({
        ...props,
        departurePlace: _departurePlace,
      });
    },
    withDepartureTime(_departureTime: string) {
      return rideBuilder({
        ...props,
        departureTime: _departureTime,
      });
    },
    withDestinationPlace(_destinationPlace: string) {
      return rideBuilder({
        ...props,
        destinationPlace: _destinationPlace,
      });
    },
    withDestinationTime(_destinationTime: string) {
      return rideBuilder({
        ...props,
        destinationTime: _destinationTime,
      });
    },
    postedAt(_postedAt: string) {
      return rideBuilder({
        ...props,
        postedAt: _postedAt,
      });
    },
    withPassengers(_passengers: User[]) {
      return rideBuilder({
        ...props,
        passengers: _passengers,
      });
    },
    build(): RideData {
      return props;
    },
  };
};
