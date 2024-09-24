import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: Record<string, any>) {
    const { accessToken, refreshToken } = await this.authService.login(
      signInDto.username,
      signInDto.password,
    );

    return {
      data: {
        accessToken,
        refreshToken,
      },
    };
  }

  @Post('refresh_token')
  async getRefreshToken(@Body() req: { refreshToken: string }) {
    const { refreshToken } = req; // 提取 refreshToken
    const { accessToken } = await this.authService.refreshToken(refreshToken); // 直接传递 refreshToken
    return {
      data: {
        accessToken,
      },
    };
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
