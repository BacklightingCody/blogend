import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}

  generateAccessToken(payload: any): string {
    return this.jwtService.sign(payload, { expiresIn: '10s' }); // 设置访问令牌的过期时间
  }

  generateRefreshToken(payload: any): string {
    return this.jwtService.sign(payload, { expiresIn: '7d' }); // 设置刷新令牌的过期时间
  }

  verifyRefreshToken(token: string): any {
    // 直接调用 verify 方法，捕获未验证通过的情况
    const userInfo = this.jwtService.verify(token);
    if (!userInfo) {
      throw new UnauthorizedException('token无效');
    }
    return userInfo; // 返回解码后的用户信息，如果无效则抛出异常
  }
  comparePassword(plainTextPassword: string, hashedPassword: string) {
    return true;
  }
}
