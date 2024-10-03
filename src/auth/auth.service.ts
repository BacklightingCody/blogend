import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenService } from '@/utils/token.service';
import { UsersService } from '@/feature/users/users.service';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
@Injectable()
export class AuthService {
  private refreshTokens: string[] = [];

  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService,
  ) {}

  // GitHub OAuth 登录逻辑
  async githubLogin(code: string): Promise<any> {
    if (!code) {
      throw new UnauthorizedException('No code provided');
    }
    console.log(code);
    const accessToken = await this.getAccessTokenFromGitHub(code);
    const gitHubUser = await this.getGitHubUser(accessToken);

    // 查找或创建 GitHub 用户
    const user = await this.usersService.findOrCreateByOAuth(gitHubUser.login);

    // 生成 JWT token
    const payload = { sub: user.userId, username: user.username };
    const accessTokenJWT = this.tokenService.generateAccessToken(payload);
    const refreshToken = this.tokenService.generateRefreshToken(payload);

    return { accessToken: accessTokenJWT, refreshToken };
  }

  // 获取 GitHub access token 的方法
  private async getAccessTokenFromGitHub(code: string): Promise<string> {
    const clientId = this.configService.get<string>('GITHUB_CLIENT_ID');
    const clientSecret = this.configService.get<string>('GITHUB_CLIENT_SECRET');

    const response = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: clientId,
        client_secret: clientSecret,
        code,
      },
      {
        headers: { Accept: 'application/json' },
      },
    );

    if (!response.data.access_token) {
      throw new UnauthorizedException('Failed to retrieve GitHub access token');
    }
    console.log(response.data.access_token);
    return response.data.access_token;
  }

  // 获取 GitHub 用户信息
  private async getGitHubUser(accessToken: string): Promise<any> {
    const response = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.data) {
      throw new UnauthorizedException('Failed to retrieve GitHub user info');
    }
    console.log(response.data);
    return response.data;
  }
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
    console.log(this.refreshTokens, '3');
    const newAccessToken = this.tokenService.generateAccessToken(payload);
    // const newRefreshToken = this.tokenService.generateRefreshToken(payload);

    // 删除旧的刷新令牌，存储新的刷新令牌
    // this.refreshTokens = this.refreshTokens.filter((item) => item !== refreshToken);
    // this.refreshTokens.push(newRefreshToken);

    return newAccessToken;
  }

  logout(token: string) {
    this.refreshTokens = this.refreshTokens.filter((item) => item !== token);
  }
}
