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
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}
  // GitHub 登录重定向

  isProduction = process.env.NODE_ENV === 'production';

  @Get('github/redirect')
  async githubLoginRedirect(@Res() res: Response) {
    console.log('请求来了');
    const clientId = this.configService.get<string>('GITHUB_CLIENT_ID');
    const redirectUri = this.configService.get<string>('GITHUB_CALLBACK_URL');
    console.log(redirectUri, 11);
    // const scope = 'user:email';
    const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}`;
    res.redirect(url);
  }
  // GitHub 回调处理
  @Get('github')
  @HttpCode(HttpStatus.OK)
  async githubLoginCallback(@Query('code') code: string, @Res() res: Response) {
    try {
      const { accessToken, refreshToken, id, username } = await this.authService.githubLogin(code);
      // 将 Token 设置到 Cookie 中
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' && process.env.FRONTED_HTTPS === 'true',
        sameSite: this.isProduction ? 'none' : 'lax',
      });
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' && process.env.FRONTED_HTTPS === 'true',
        sameSite: this.isProduction ? 'none' : 'lax',
        maxAge: 60 * 1000 * 60 * 24 * 7,
      });
      res.redirect(
        `${process.env.FRONTEND_URL}?logged_in=true&&user_id=${id}&username=${username}`,
      ); // 登录成功后跳转页面
      return {
        data: {},
        msg: '登录成功',
      };
    } catch (error) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ msg: 'GitHub login failed', error });
    }
  }

  @Post('login')
  async signIn(@Body() signInDto: Record<string, any>, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken } = await this.authService.login(
      signInDto.username,
      signInDto.password,
    );
    // 设置 HttpOnly 和 Secure 的 cookie
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' && process.env.FRONTED_HTTPS === 'true',
      sameSite: this.isProduction ? 'none' : 'lax',
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' && process.env.FRONTED_HTTPS === 'true',
      sameSite: this.isProduction ? 'none' : 'lax',
    });
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
      secure: process.env.NODE_ENV === 'production' && process.env.BACKEND_HTTPS === 'true',
    });
    // res.cookie('refreshToken', newRefreshToken, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production' && process.env.FRONTED_HTTPS === 'true',
    //   sameSite: this.isProduction ? 'none' : 'lax'
    // });

    return {
      data: {},
      msg: '令牌刷新成功',
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
