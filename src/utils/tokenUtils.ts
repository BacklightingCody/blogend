// import { Injectable } from '@nestjs/common';
// import jwt, { JwtPayload } from 'jsonwebtoken';

// @Injectable()
// export class TokenUtil {
//   private readonly ACCESS_TOKEN_SECRET =
//     process.env.ACCESS_TOKEN_SECRET || 'backlighting';
//   private readonly REFRESH_TOKEN_SECRET =
//     process.env.REFRESH_TOKEN_SECRET || 'pitilessmiracle';
//   private readonly ACCESS_TOKEN_EXPIRATION = '10s';
//   private readonly REFRESH_TOKEN_EXPIRATION = '7d';

//   generateAccessToken(userinfo: { username: string }) {
//     return jwt.sign(userinfo, this.ACCESS_TOKEN_SECRET, {
//       expiresIn: this.ACCESS_TOKEN_EXPIRATION,
//     });
//   }

//   generateRefreshToken(userinfo: { username: string }) {
//     return jwt.sign(userinfo, this.REFRESH_TOKEN_SECRET, {
//       expiresIn: this.REFRESH_TOKEN_EXPIRATION,
//     });
//   }

//   verifyAccessToken(token: string): JwtPayload | null {
//     try {
//       return jwt.verify(token, this.ACCESS_TOKEN_SECRET) as JwtPayload;
//     } catch {
//       return null;
//     }
//   }

//   verifyRefreshToken(token: string): JwtPayload | null {
//     try {
//       return jwt.verify(token, this.REFRESH_TOKEN_SECRET) as JwtPayload;
//     } catch {
//       return null;
//     }
//   }
// }
