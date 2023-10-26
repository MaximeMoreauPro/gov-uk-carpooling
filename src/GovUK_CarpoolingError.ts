export type GovUK_CarpoolingErrorCode =
  | 'EmptyPlaceError'
  | 'DepartureTimeAfterDestinationTimeError'
  | 'PassedDepartureTimeError'
  | 'SameDepartureAndDestinationPlaceError'
  | 'WrongFormatDatetimeError';

const DEFAULT_ERROR_MESSAGE: Record<GovUK_CarpoolingErrorCode, string> = {
  EmptyPlaceError: 'the place must not be empty',
  DepartureTimeAfterDestinationTimeError:
    'the departure time must be before the destination time',
  PassedDepartureTimeError: 'the departure time must be in the future',
  SameDepartureAndDestinationPlaceError:
    'the departure and destination places must be different',
  WrongFormatDatetimeError:
    'the datetime must be in the ISO 8601 format YYYY-MM-DDTHH:mm:ss.sssZ',
};

export class GovUK_CarpoolingError extends Error {
  code: GovUK_CarpoolingErrorCode;

  constructor(code: GovUK_CarpoolingErrorCode, message?: string) {
    super(message || DEFAULT_ERROR_MESSAGE[code]);
    this.code = code;
  }
}
