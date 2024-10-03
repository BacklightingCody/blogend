// import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { Request, Response } from 'express';
// import axios from 'axios';
// import { AuthService } from './auth.service';

// @Injectable()
// export class GitHubGuard implements CanActivate {
//   constructor(
//     private configService: ConfigService,
//     private authService: AuthService,
//   ) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const request = context.switchToHttp().getRequest<Request>();
//     const response = context.switchToHttp().getResponse<Response>();
//     const code = request.query.code as string;

//     // 如果没有code说明是首次登录，重定向到 GitHub 授权页面
//     if (!code) {
//       console.log('no code');
//       const clientId = this.configService.get<string>('GITHUB_CLIENT_ID');
//       console.log(clientId);
//       const redirectUri = this.configService.get<string>('GITHUB_CALLBACK_URL');
//       console.log(redirectUri);
//       const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}`;
//       response.redirect(redirectUrl);
//       return false; // 直接返回 false，停止后续处理
//     } else {
//       console.log('code');
//       // 当存在 code 时，获取访问令牌并返回用户信息
//       const accessToken = await this.getAccessToken(code);
//       const gitHubUser = await this.getGitHubUser(accessToken);

//       // 使用 AuthService 进行 OAuth 登录
//       await this.authService.githubLogin(gitHubUser);
//       request.user = gitHubUser; // 将用户信息附加到请求对象中
//       return true; // 返回 true，允许后续处理
//     }
//   }

//   private async getAccessToken(code: string): Promise<string> {
//     const clientId = this.configService.get<string>('GITHUB_CLIENT_ID');
//     const clientSecret = this.configService.get<string>('GITHUB_CLIENT_SECRET');

//     const response = await axios.post(
//       'https://github.com/login/oauth/access_token',
//       {
//         client_id: clientId,
//         client_secret: clientSecret,
//         code,
//       },
//       {
//         headers: { Accept: 'application/json' },
//       },
//     );

//     if (!response.data.access_token) {
//       throw new UnauthorizedException('Failed to retrieve GitHub access token');
//     }

//     return response.data.access_token;
//   }

//   private async getGitHubUser(accessToken: string): Promise<any> {
//     const response = await axios.get('https://api.github.com/user', {
//       headers: { Authorization: `Bearer ${accessToken}` },
//     });

//     if (!response.data) {
//       throw new UnauthorizedException('Failed to retrieve GitHub user info');
//     }

//     return response.data;
//   }
// }
