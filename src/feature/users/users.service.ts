import { Injectable } from '@nestjs/common';
import { PrismaService } from '#/prisma.service';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // 根据用户名查找用户
  async findOne(username: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  // 查找或通过 OAuth 创建用户
  async findOrCreateByOAuth(dto: CreateUserDto): Promise<User> {
    // 查找现有用户
    let user = await this.findOne(dto.username);

    // 如果用户不存在，创建一个新用户
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          username: dto.username,
          avatarUrl: dto.avatarUrl,
          email: dto.email,
          bio: dto.bio,
          password: dto.password, // OAuth 用户不需要密码
        },
      });
    }

    return user;
  }
}
