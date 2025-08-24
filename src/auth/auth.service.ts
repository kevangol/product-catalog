import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  // very simple in-memory OTP store (mobile -> code). For demo only.
  private otpStore = new Map<string, { code: string; expiresAt: number }>();

  constructor(
    private jwt: JwtService,
    private users: UsersService,
    private configService: ConfigService,
  ) {}

  requestOtp(mobile: string) {
    // In real life, generate and send SMS; here fixed "1234"
    const code = '1234';
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
    this.otpStore.set(mobile, { code, expiresAt });
    return { message: 'OTP sent (use 1234 for demo)' };
  }

  async verifyOtp(mobile: string, otp: string) {
    const rec = this.otpStore.get(mobile);
    if (!rec || rec.expiresAt < Date.now() || rec.code !== otp) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    const user = await this.users.upsertByMobile(mobile);
    const tokens = await this.issueTokens(user.id, user.mobile);

    // consume OTP
    this.otpStore.delete(mobile);

    return { user: { id: user.id, mobile: user.mobile }, ...tokens };
  }

  private async issueTokens(userId: string, mobile: string) {
    const payload = { sub: userId, mobile };

    const accessToken = await this.jwt.signAsync(payload, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_EXP'),
    });

    const refreshToken = await this.jwt.signAsync(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXP'),
    });

    return { accessToken, refreshToken };
  }

  async refresh(refreshToken: string | undefined) {
    if (!refreshToken) throw new UnauthorizedException('Missing refresh token');

    interface JwtPayload {
      sub: string;
      mobile: string;
      [key: string]: any;
    }
    let decoded: JwtPayload;
    try {
      decoded = await this.jwt.verifyAsync<JwtPayload>(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return this.issueTokens(decoded.sub, decoded.mobile);
  }
}
