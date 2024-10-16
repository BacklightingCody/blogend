import { Controller, Get, HttpCode, HttpStatus, Req, UseGuards } from '@nestjs/common';
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
  // async getUserInfo(@Query('id') id: string, @Query('username') username: string) {
  async getUserInfo(@Req() request) {
    // 根据 ID 或用户名查找用户
    console.log(request.cookies);
    const userinfo = request.user;
    const identifier = userinfo.id ? userinfo.id : userinfo.sub || userinfo.username;
    if (!identifier) {
      return {
        msg: 'Missing identifier',
        data: {},
      };
    }

    const user = await this.usersService.findOne(identifier);
    if (!user) {
      return {
        code: 401,
        msg: '用户未登录',
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
