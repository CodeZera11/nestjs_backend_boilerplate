import { Global, Module } from '@nestjs/common';
import { PrismaService } from './providers/prisma/prisma.service';
import { CommonController } from './common.controller';
import { EmailService } from './providers/email/email.service';

@Global()
@Module({
  providers: [PrismaService, EmailService],
  exports: [PrismaService, EmailService],
  controllers: [CommonController],
})
export class CommonModule {}
