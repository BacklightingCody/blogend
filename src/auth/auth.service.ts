import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenService } from '@/utils/token.service';
import { UsersService } from '@/feature/users/users.service';

@Injectable()
export class AuthService {
  private refreshTokens: string[] = [];

  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
  ) {}

  async login(username: string, password: string) {
    const user = await this.usersService.findOne(username);
    if (user?.password !== password) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    const payload = { sub: user.userId, username: user.username };
    const accessToken = this.tokenService.generateAccessToken(payload);
    const refreshToken = this.tokenService.generateRefreshToken(payload);

    this.refreshTokens.push(refreshToken); // 保存刷新令牌

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string) {
    if (!refreshToken || !this.refreshTokens.includes(refreshToken)) {
      throw new UnauthorizedException('无效的刷新令牌');
    }

    const userInfo = this.tokenService.verifyRefreshToken(refreshToken); // 验证刷新令牌

    const payload = { username: userInfo.username };
    const accessToken = this.tokenService.generateAccessToken(payload);

    return { accessToken };
  }

  logout(token: string) {
    this.refreshTokens = this.refreshTokens.filter((item) => item !== token);
  }
}
