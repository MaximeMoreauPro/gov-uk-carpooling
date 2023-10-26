import { Entity } from './Entity';

export class User extends Entity {
  private constructor(
    id: string,
    readonly firstName: string,
    readonly lastName: string,
    readonly email: string
  ) {
    super(id);
  }
}
