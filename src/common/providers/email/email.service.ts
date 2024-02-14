import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false,
      auth: {
        user: 'purplroof@gmail.com',
        pass: 'dqL1hwQygPrC9sWS',
      },
    });
  }

  async sendEmail(sendEmailRequest: {
    emailTo: string;
    subject: string;
    message: string;
    emailFrom: string;
  }) {
    const info = await this.transporter.sendMail({
      from: sendEmailRequest.emailFrom,
      to: [sendEmailRequest.emailTo],
      subject: sendEmailRequest.subject,
      text: sendEmailRequest.message,
    });

    return info;
  }
}
