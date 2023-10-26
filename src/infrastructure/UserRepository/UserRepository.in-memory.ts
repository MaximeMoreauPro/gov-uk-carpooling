import { UserRepository } from '@/application/repositories/UserRepository';
import { User } from '@/domain/User';

export class InMemoryUserRepository implements UserRepository {
  users: User[] = [];

  async save(userToSave: User): Promise<void> {
    this.users.push(userToSave);
    return Promise.resolve();
  }

  async getUser(userId: string): Promise<User | undefined> {
    const user = this.users.find(({ id }) => id === userId);
    return Promise.resolve(user);
  }

  async getUserByEmail(userEmail: string): Promise<User | undefined> {
    const user = this.users.find(({ email }) => email === userEmail);
    return Promise.resolve(user);
  }
}
