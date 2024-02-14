import { IsEmail, IsNotEmpty } from 'class-validator';
import { BaseRequest } from 'src/utils/BaseRequest';

export class SendEmailDto extends BaseRequest {
  @IsNotEmpty()
  subject: string;

  @IsNotEmpty()
  @IsEmail()
  emailFrom: string;

  @IsNotEmpty()
  @IsEmail()
  emailTo: string;

  @IsNotEmpty()
  message: string;
}
