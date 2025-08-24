import { IsNotEmpty, Matches } from 'class-validator';

export class RequestOtpDto {
  @IsNotEmpty()
  @Matches(/^[6-9]\d{9}$/) // simple India mobile pattern; tweak as needed
  mobile: string;
}
