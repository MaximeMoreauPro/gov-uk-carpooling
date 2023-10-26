import { RideData } from '@/domain/Ride';
import { User } from '@/domain/User';

export interface RideRepository {
  postRide: (ride: RideData) => Promise<void>;
  getRidesPostedByDriver(userId: string): Promise<RideData[]>;
  getRidesBookedByPassenger(userId: string): Promise<RideData[]>;
  bookRide(params: { user: User; ride: RideData }): Promise<void>;
}
