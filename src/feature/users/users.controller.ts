import { Controller, Get, HttpCode, HttpStatus, Query, UseGuards } from '@nestjs/common';
// import { Response } from 'express';
import { UsersService } from './users.service';
import { AuthGuard } from '@/auth/auth.guard';
// import { AuthService } from '@/auth/auth.service';
@Controller('user')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @HttpCode(HttpStatus.OK)
  @Get('info')
  async getUserInfo(@Query('userId') userId: string, @Query('username') username: string) {
    // 确保接收到的参数非空
    const identifier = userId || username;
    if (!identifier) {
      return {
        msg: 'Missing identifier',
        data: {},
      };
    }

    // 根据传入的 userId 或 username 查询用户
    const user = await this.usersService.findOne(identifier);
    if (!user) {
      return {
        code: 404,
        msg: '用户未找到',
        data: {},
      };
    }

    // 返回用户信息
    return {
      data: {
        id: user.id,
        username: user.username,
        avatarUrl: user.avatarUrl,
      },
      msg: '登录成功',
    };
  }
}
