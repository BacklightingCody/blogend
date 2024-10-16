import { Injectable } from '@nestjs/common';
import { PrismaService } from '#/prisma.service';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/user.dto';
@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // 根据用户名或ID查找用户
  async findOne(identifier: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        OR: [
          { id: identifier }, // 根据ID查找
          { username: identifier }, // 根据用户名查找
        ],
      },
    });
  }

  // 查找或通过 OAuth 创建用户
  async findOrCreateByOAuth(dto: CreateUserDto): Promise<User> {
    console.log(dto);

    // 查找现有用户
    console.log('查找');
    let user = await this.findOne(dto.id); // 根据ID查找
    if (!user) {
      user = await this.findOne(dto.username); // 如果没有找到，根据用户名查找
    }

    console.log(user, '111');

    // 如果用户不存在，创建一个新用户
    if (!user) {
      console.log('创建');
      user = await this.prisma.user.create({
        data: {
          id: dto.id || Date.now().toString(), // 使用生成的 ID
          username: dto.username || null,
          avatarUrl: dto.avatarUrl || null,
          email: dto.email || null, // 如果有 email 则使用
          bio: dto.bio || null, // 如果有 bio 则使用
          password: null, // OAuth 用户不需要密码
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      console.log(user, '222');
    }

    console.log(user);
    return user;
  }
}
