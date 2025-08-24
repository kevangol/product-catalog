import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import * as passportJwt from 'passport-jwt';
const { ExtractJwt, Strategy } = passportJwt;
import { cookieAccessTokenExtractor } from './cookie-extractor';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieAccessTokenExtractor, // read from httpOnly cookie
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get(
        'JWT_ACCESS_SECRET',
        'dev_access_secret_replace_me',
      ),
    });
  }

  validate(payload: { sub: string; mobile: string }) {
    // attach to req.user
    return { sub: payload.sub, mobile: payload.mobile };
  }
}
