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
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: Record<string, any>, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken } = await this.authService.login(
      signInDto.username,
      signInDto.password,
    );
    // 设置 HttpOnly 和 Secure 的 cookie
    res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'strict' });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'strict' });
    return {
      data: {},
    };
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh_token')
  async getRefreshToken(
    @Body() body: { refreshToken: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken } = body;
    console.log(refreshToken);
    const newAccessToken = await this.authService.refreshToken(refreshToken);

    // 更新 HttpOnly Cookie 中的 accessToken 和 refreshToken
    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: true,
    });
    // res.cookie('refreshToken', newRefreshToken, {
    //   httpOnly: true,
    //   secure: true,
    // });

    return {
      data: {},
      message: '令牌刷新成功',
    };
  }

  @UseGuards(AuthGuard)
  @Get('more')
  getProfile(@Param() id: number) {
    console.log(id);
    return {
      data: { acess: '111' },
      msg: '获取成功',
    };
  }
}
