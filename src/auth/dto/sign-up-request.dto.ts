import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class SignUpRequest {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  password: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsOptional()
  supervisionTier: string;

  @IsOptional()
  supervisionLevel: string;

  @IsDateString()
  dateOfBirth: string;

  @IsOptional()
  attorneyName: string;

  @IsOptional()
  attorneyEmail: string;

  @IsOptional()
  attorneyPhone: string;

  @IsOptional()
  charge: string;

  @IsOptional()
  chargeDescription: string;

  @IsOptional()
  docketNumber: string;
}
