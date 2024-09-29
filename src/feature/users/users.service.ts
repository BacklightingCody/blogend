import { Injectable } from '@nestjs/common';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
  private readonly users = [
    {
      userId: 1,
      username: 'john',
      password: 'changeme',
    },
    {
      userId: 2,
      username: 'maria',
      password: 'guess',
    },
    {
      userId: 3,
      username: 'admin',
      password: 'admin',
    },
    {
      userId: 4,
      username: 'backlighting',
      password: '123456',
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }

  async findOrCreateByOAuth(username: string): Promise<User> {
    let user = await this.findOne(username);
    if (!user) {
      // If user does not exist, create a new one
      user = {
        userId: this.users.length + 1, // Simple ID assignment, you may want to replace this with a more robust method
        username,
        password: null, // No password for OAuth users
      };
      this.users.push(user);
    }
    return user;
  }
}
