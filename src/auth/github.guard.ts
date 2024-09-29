import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import axios from 'axios';

@Injectable()
export class GitHubGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const code = request.query.code as string;

    if (!code) {
      const clientId = this.configService.get<string>('GITHUB_CLIENT_ID');
      console.log(clientId);
      const redirectUri = this.configService.get<string>('GITHUB_CALLBACK_URL'); // 从环境变量中读取
      const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user`;
      context.switchToHttp().getResponse().redirect(redirectUrl);
      return false;
    }

    // 获取 GitHub access token
    const accessToken = await this.getAccessToken(code);
    const user = await this.getGitHubUser(accessToken);

    // 将 GitHub 用户信息放到请求对象中
    request['user'] = user;

    return true;
  }

  private async getAccessToken(code: string): Promise<string> {
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

    return response.data.access_token;
  }

  private async getGitHubUser(accessToken: string): Promise<any> {
    const response = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.data) {
      throw new UnauthorizedException('Failed to retrieve GitHub user info');
    }

    return response.data;
  }
}
