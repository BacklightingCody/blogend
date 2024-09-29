// github.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigInterface } from './interfaces/config.interface';

@Injectable()
export class GithubService {
  constructor(private configService: ConfigService) {}

  getGithubCredentials(): ConfigInterface['github'] {
    const githubConfig = this.configService.get<ConfigInterface['github']>('github');
    return githubConfig;
  }
}
