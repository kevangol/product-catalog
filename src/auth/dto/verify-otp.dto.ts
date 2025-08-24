import { IsNotEmpty, Matches } from 'class-validator';

export class VerifyOtpDto {
  @IsNotEmpty()
  @Matches(/^[6-9]\d{9}$/)
  mobile: string;

  @IsNotEmpty()
  otp: string; // must be "1234" in this simple demo
}
