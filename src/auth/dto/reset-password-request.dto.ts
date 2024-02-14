import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class ResetPasswordRequest {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  resetPasswordToken: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  confirmNewPassword: string;
}
