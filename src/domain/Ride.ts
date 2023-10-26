import { GovUK_CarpoolingError } from '../GovUK_CarpoolingError';
import { Entity } from './Entity';
import { User } from './User';

export type RideData = Ride['data'];

export class Ride extends Entity {
  readonly passengers: User[] = [];

  private constructor(
    id: string,
    readonly driver: User,
    readonly departurePlace: string,
    readonly departureTime: string,
    readonly destinationPlace: string,
    readonly destinationTime: string,
    readonly postedAt: string
  ) {
    super(id);
  }

  get data() {
    return {
      id: this.id,
      driver: this.driver,
      departurePlace: this.departurePlace,
      departureTime: this.departureTime,
      destinationPlace: this.destinationPlace,
      destinationTime: this.destinationTime,
      postedAt: this.postedAt,
      passengers: this.passengers,
    };
  }

  static fromData(data: RideData) {
    checkDatetime(data.departureTime);
    checkDatetime(data.destinationTime);
    checkDatetime(data.postedAt);

    checkPassedDepartureTime(data.departureTime, data.postedAt);

    checkDepartureTimeAfterDestinationTime(
      data.destinationTime,
      data.departureTime
    );

    const trimedDeparturePlace = data.departurePlace.trim();
    const trimedDestinationPlace = data.destinationPlace.trim();

    checkEmptyPlace(trimedDeparturePlace);
    checkEmptyPlace(trimedDestinationPlace);

    checkSameDepartureAndDestinationPlace(
      trimedDeparturePlace,
      trimedDestinationPlace
    );

    return new Ride(
      data.id,
      data.driver,
      trimedDeparturePlace,
      data.departureTime,
      trimedDestinationPlace,
      data.destinationTime,
      data.postedAt
    );
  }
}

function checkDatetime(date: string) {
  if (
    !/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/.test(
      date
    )
  ) {
    throw new GovUK_CarpoolingError('WrongFormatDatetimeError');
  }
}

function checkPassedDepartureTime(departureTime: string, postedAt: string) {
  if (departureTime <= postedAt) {
    throw new GovUK_CarpoolingError('PassedDepartureTimeError');
  }
}

function checkDepartureTimeAfterDestinationTime(
  destinationTime: string,
  departureTime: string
) {
  if (destinationTime <= departureTime) {
    throw new GovUK_CarpoolingError('DepartureTimeAfterDestinationTimeError');
  }
}

function checkEmptyPlace(place: string) {
  if (place.length === 0) {
    throw new GovUK_CarpoolingError('EmptyPlaceError');
  }
}

function checkSameDepartureAndDestinationPlace(
  departurePlace: string,
  destinationPlace: string
) {
  if (departurePlace === destinationPlace) {
    throw new GovUK_CarpoolingError('SameDepartureAndDestinationPlaceError');
  }
}
