import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
  Param,
  Query,
} from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users.service';
import { AuthGuard } from '@/auth/auth.guard';

@Controller('user')
export class UsersController {
  constructor(private usersService: UsersService) {}

  // @UseGuards(AuthGuard)
  @Get('info')
  getUserInfo() {
    console.log('获取信息');
    return {
      data: { avatarurl: '12321' },
      msg: '获取成功',
    };
  }
}
