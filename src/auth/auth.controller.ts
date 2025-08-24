import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

const cookieOpts = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: false, // set true behind HTTPS
  path: '/',
};

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('request-otp')
  requestOtp(@Body() dto: RequestOtpDto) {
    return this.auth.requestOtp(dto.mobile);
  }

  @Post('verify-otp')
  async verifyOtp(
    @Body() dto: VerifyOtpDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken, refreshToken } = await this.auth.verifyOtp(
      dto.mobile,
      dto.otp,
    );

    res.cookie('access_token', accessToken, {
      ...cookieOpts,
      maxAge: 15 * 60 * 1000,
    });
    res.cookie('refresh_token', refreshToken, {
      ...cookieOpts,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { user, message: 'Logged in' };
  }

  @Post('refresh')
  async refresh(@Res({ passthrough: true }) res: Response) {
    // read cookie
    const req = res.req as import('express').Request;
    const cookies = req.cookies as Record<string, string> | undefined;
    const refreshToken: string | undefined = cookies?.['refresh_token'];
    const tokens = await this.auth.refresh(refreshToken);
    res.cookie('access_token', tokens.accessToken, {
      ...cookieOpts,
      maxAge: 15 * 60 * 1000,
    });
    res.cookie('refresh_token', tokens.refreshToken, {
      ...cookieOpts,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return { message: 'Refreshed' };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token', { path: '/' });
    res.clearCookie('refresh_token', { path: '/' });
    return { message: 'Logged out' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me() {
    return { ok: true };
  }
}
