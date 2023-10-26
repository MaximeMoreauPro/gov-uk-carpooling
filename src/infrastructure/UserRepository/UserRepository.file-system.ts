import * as fs from 'fs';

import { UserRepository } from '@/application/repositories/UserRepository';
import { User } from '@/domain/User';

export class FileSystemUserRepository implements UserRepository {
  constructor(private readonly _usersFile: string) {}

  async save(userToSave: User): Promise<void> {
    const allUsers = await this.readAllUsersFromFile();

    allUsers.push(userToSave);

    return fs.promises.writeFile(this._usersFile, JSON.stringify(allUsers));
  }

  async getUser(userId: string): Promise<User | undefined> {
    const allUsers = await this.readAllUsersFromFile();

    return allUsers.find(user => user.id === userId);
  }

  async getUserByEmail(userEmail: string): Promise<User | undefined> {
    const allUsers = await this.readAllUsersFromFile();

    return allUsers.find(user => user.email === userEmail);
  }

  private async readAllUsersFromFile(): Promise<User[]> {
    try {
      const buffer = await fs.promises.readFile(this._usersFile);

      return JSON.parse(buffer.toString()) as User[];
    } catch (e) {
      return [];
    }
  }
}
