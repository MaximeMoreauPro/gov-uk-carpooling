import * as path from 'path';
import * as fs from 'fs';

import { UserRepository } from '@/application/repositories/UserRepository';
import { Alex, Bob, Zoe } from '@/infrastructure/tests/User.test-data';

import { FileSystemUserRepository } from './UserRepository.file-system';
import { InMemoryUserRepository } from './UserRepository.in-memory';

const USERS_TEST_FILE = path.join(__dirname, 'users-test.json');

describe('UserRepository', () => {
  runUserRepositoryTests(
    'FileSystemUserRepository',
    () => new FileSystemUserRepository(USERS_TEST_FILE),
    () => {
      try {
        return fs.promises.rm(USERS_TEST_FILE, { force: true });
      } catch (e) {
        console.error(e);
      }
      return Promise.resolve();
    }
  );
  runUserRepositoryTests(
    'InMemoryUserRepository',
    () => new InMemoryUserRepository()
  );
});

function runUserRepositoryTests(
  userRepositoryImplementation:
    | 'FileSystemUserRepository'
    | 'InMemoryUserRepository',
  userRepositoryFactory: () => UserRepository,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  reset: () => Promise<void> = async () => {}
) {
  describe(userRepositoryImplementation, () => {
    let userRepository: UserRepository;

    beforeEach(async () => {
      await reset();

      userRepository = userRepositoryFactory();
    });

    afterAll(async () => {
      await reset();
    });

    it('should save a User', async () => {
      await userRepository.save(Alex);
    });

    it('should get User by its id', async () => {
      await userRepository.save(Alex);
      await userRepository.save(Zoe);
      await userRepository.save(Bob);

      const users = await Promise.all([
        userRepository.getUser(Alex.id),
        userRepository.getUser(Zoe.id),
        userRepository.getUser(Bob.id),
      ]);
      expect(users).toStrictEqual([Alex, Zoe, Bob]);
    });

    it('should get User by its email', async () => {
      await userRepository.save(Alex);
      await userRepository.save(Zoe);
      await userRepository.save(Bob);

      const users = await Promise.all([
        userRepository.getUserByEmail(Alex.email),
        userRepository.getUserByEmail(Zoe.email),
        userRepository.getUserByEmail(Bob.email),
      ]);
      expect(users).toStrictEqual([Alex, Zoe, Bob]);
    });
  });
}
