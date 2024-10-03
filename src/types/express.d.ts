import * as express from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any; // 这里的 any 可以替换为你具体的用户类型
    }
  }
}
