import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService, // 引入 AuthService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const token = this.extractTokenFromCookies(request);
    console.log('token:', token);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      // 尝试验证 accessToken
      const payload = await this.jwtService.verifyAsync(token);
      request['user'] = payload; // 将用户信息附加到请求对象

      // 检查 accessToken 是否快过期
      const expirationTime = this.getExpirationTime(token);
      if (expirationTime && expirationTime < 3 * 60 * 1000) {
        // 剩余时间少于3分钟
        console.log('Access token is about to expire, refreshing...');
        const newAccessToken = await this.authService.refreshToken(request.cookies['refreshToken']);
        if (newAccessToken) {
          // 使用 Set-Cookie 响应头更新 accessToken
          response.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            path: '/',
            sameSite: 'strict',
            // secure: true, // 在生产环境中使用 HTTPS
          });
          request.cookies['accessToken'] = newAccessToken; // 更新 request 中的 accessToken
        } else {
          throw new UnauthorizedException('Failed to refresh access token');
        }
      }
    } catch (error) {
      console.log(error);
      // 如果 accessToken 过期，尝试使用 refreshToken 刷新 token
      if (error.name === 'TokenExpiredError') {
        console.log('Access token expired, trying to refresh...');
        console.log(request.cookies['refreshToken']);
        const newAccessToken = await this.authService.refreshToken(request.cookies['refreshToken']);
        console.log(newAccessToken, 'new');
        if (newAccessToken) {
          response.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            path: '/',
            sameSite: 'strict',
            // secure: true, // 在生产环境中使用 HTTPS
          });
          request.cookies['accessToken'] = newAccessToken; // 更新 request 中的 accessToken
          return true; // 允许请求继续
        } else {
          throw new UnauthorizedException('Failed to refresh access token');
        }
      }
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromCookies(request: Request): string | undefined {
    return request.cookies['accessToken'];
  }

  private getExpirationTime(token: string): number | undefined {
    const decoded: any = this.jwtService.decode(token);
    if (decoded && decoded.exp) {
      return decoded.exp * 1000 - Date.now(); // 剩余时间（毫秒）
    }
    return undefined;
  }
}
