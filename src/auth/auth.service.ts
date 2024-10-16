import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenService } from '@/utils/token.service';
import { UsersService } from '@/feature/users/users.service';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-user.dto';
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
  async githubLogin(
    code: string,
  ): Promise<{ accessToken: string; refreshToken: string; id: string; username: string }> {
    if (!code) {
      throw new UnauthorizedException('No code provided');
    }

    const accessToken = await this.getAccessTokenFromGitHub(code);
    const gitHubUser = await this.getGitHubUser(accessToken);
    console.log(gitHubUser);
    // 构建 DTO 对象
    const createUserDto: CreateUserDto = {
      id: Date.now().toString(), // 以时间戳为 ID
      username: gitHubUser.login,
      avatarUrl: gitHubUser.avatar_url,
      bio: gitHubUser.bio || null,
      email: gitHubUser.email || null, // 如果 GitHub 提供了 email
      password: null,
    };

    // 查找或创建 GitHub 用户
    const user = await this.usersService.findOrCreateByOAuth(createUserDto);
    console.log(user);
    // 生成 JWT token
    const payload = { sub: user.id, username: user.username };
    const accessTokenJWT = this.tokenService.generateAccessToken(payload);
    const refreshToken = this.tokenService.generateRefreshToken(payload);
    this.refreshTokens.push(refreshToken);
    return { accessToken: accessTokenJWT, refreshToken, id: user.id, username: user.username };
  }

  // 获取 GitHub access token 的方法
  private async getAccessTokenFromGitHub(code: string): Promise<string> {
    const clientId = this.configService.get<string>('GITHUB_CLIENT_ID');
    const clientSecret = this.configService.get<string>('GITHUB_CLIENT_SECRET');

    try {
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

      return response.data.access_token;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Error fetching access token from GitHub');
    }
  }

  // 获取 GitHub 用户信息
  private async getGitHubUser(accessToken: string): Promise<any> {
    try {
      const response = await axios.get('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!response.data) {
        throw new UnauthorizedException('Failed to retrieve GitHub user info');
      }

      return response.data;
    } catch (error) {
      throw new UnauthorizedException('Error fetching user info from GitHub');
    }
  }

  async login(username: string, password: string) {
    const user = await this.usersService.findOne(username);
    if (!user || !(await this.tokenService.comparePassword(password, user.password))) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    const payload = { sub: user.id, username: user.username };
    const accessToken = this.tokenService.generateAccessToken(payload);
    const refreshToken = this.tokenService.generateRefreshToken(payload);

    this.refreshTokens.push(refreshToken); // 保存刷新令牌

    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string) {
    console.log('refresh');
    // console.log(this.refreshTokens);
    if (!refreshToken || !this.refreshTokens.includes(refreshToken)) {
      throw new UnauthorizedException('无效的刷新令牌');
    }
    console.log(refreshToken);
    const userInfo = this.tokenService.verifyRefreshToken(refreshToken); // 验证刷新令牌
    console.log(userInfo);
    const payload = { id: userInfo.id, username: userInfo.username };

    const newAccessToken = this.tokenService.generateAccessToken(payload);
    // 如果需要，生成新的刷新令牌并更新

    return newAccessToken;
  }

  logout(token: string) {
    this.refreshTokens = this.refreshTokens.filter((item) => item !== token);
  }
}
