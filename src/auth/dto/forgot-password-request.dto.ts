import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class ForgotPasswordRequest {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  email: string;
}
