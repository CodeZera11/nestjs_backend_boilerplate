import { Body, Controller, Get, Post } from '@nestjs/common';
import { EmailService } from './providers/email/email.service';
import { SendEmailDto } from './providers/email/send-email.dto';

@Controller('common')
export class CommonController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send-email')
  async SendEmail(@Body() sendEmailRequest: SendEmailDto) {
    return await this.emailService.sendEmail(sendEmailRequest);
  }

  @Get()
  async getHello() {
    console.log('hello');
  }
}
