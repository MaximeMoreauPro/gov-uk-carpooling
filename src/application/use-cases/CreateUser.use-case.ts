import { z } from 'zod';

import { IdProvider } from '@/application/providers/IdProvider';
import { UserRepository } from '@/application/repositories/UserRepository';

const CreateUserCommandSchema = z
  .object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
  })
  .strict();

export type CreateUserCommand = z.infer<typeof CreateUserCommandSchema>;

export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly idProvider: IdProvider
  ) {}

  async handle(createUserCommand: CreateUserCommand): Promise<void> {
    CreateUserCommandSchema.parse(createUserCommand);

    await this.userRepository.save({
      id: this.idProvider.getId(),
      ...createUserCommand,
    });
  }
}
