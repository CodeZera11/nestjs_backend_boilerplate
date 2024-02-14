import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInRequest } from './dto/sign-in-request.dto';
import { SignUpRequest } from './dto/sign-up-request.dto';
import { PrismaService } from 'src/common/providers/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UserRoleEnum } from '@prisma/client';
import { generateToken } from 'src/utils/jwt-utils';
import { randomBytes } from 'crypto';
import { ForgotPasswordRequest } from './dto/forgot-password-request.dto';
import { EmailService } from 'src/common/providers/email/email.service';
import { ResetPasswordRequest } from './dto/reset-password-request.dto';
import { UiPageLinks } from 'src/constants/ui-links';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  async signIn(request: SignInRequest) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: request.email,
      },
    });

    if (!user) {
      throw new BadRequestException('User does not exist');
    }

    const isPasswordValid = await bcrypt.compare(
      request.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid password');
    }

    delete user.password;

    const jwtToken = generateToken({
      userAuthId: user.authId ?? '',
      userId: user.id,
      email: user.email,
      username: `${user.firstName} ${user.lastName}`,
      role: user.role,
      forcePasswordChange: user.forcePasswordChange,
    });

    return { user, jwtToken };
  }

  async signUp(request: SignUpRequest) {
    let user;

    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: request.email,
      },
    });

    if (existingUser) {
      throw new UnauthorizedException('User already exists');
    }

    try {
      const random = randomBytes(16).toString('hex');

      user = await this.prisma.user.create({
        data: {
          email: request.email,
          firstName: request.firstName,
          lastName: request.lastName,
          phoneNumber: request.phoneNumber,
          dateOfBirth: request.dateOfBirth,
          attorneyName: request.attorneyName,
          attorneyEmail: request.attorneyEmail,
          attorneyPhone: request.attorneyPhone,
          charge: request.charge,
          chargeDescription: request.chargeDescription,
          supervisionTier: request.supervisionTier,
          supervisionLevel: request.supervisionLevel,
          docketNumber: request.docketNumber,
          password: await this.createPasswordHash(request.password),
          role: UserRoleEnum.CASE_MANAGER,
          authId: random,
        } as any,
      });

      const jwtToken = generateToken({
        userAuthId: random,
        userId: user.id,
        email: user.email,
        username: user.firstName,
        role: user.role,
      });

      return { user, jwtToken };
    } catch (e: any) {
      // if (authUser) await this.deleteAuthUser(authUser?.uid);
      if (user)
        await this.prisma.user.delete({
          where: {
            email: request.email,
          },
        });
      throw new Error(e.message);
    }
  }

  async forgotPassword(forgotPassword: ForgotPasswordRequest) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: forgotPassword.email,
      },
    });

    if (!existingUser) {
      throw new BadRequestException('User does not exist');
    }

    const random = randomBytes(16).toString('hex');

    await this.prisma.user.update({
      where: {
        email: forgotPassword.email,
      },
      data: {
        passwordResetToken: random,
      },
    });

    const resetPasswordLink = UiPageLinks.ResetPasswordPage + random;

    await this.emailService.sendEmail({
      emailFrom: 'bhaveshy737@gmail.com',
      emailTo: forgotPassword.email,
      subject: 'Reset Password',
      message: `To reset your password you can click on the link ${resetPasswordLink}`,
    });

    return { message: 'Password reset link sent successfully' };
  }

  async resetPassword(resetPasswordRequest: ResetPasswordRequest) {
    if (
      resetPasswordRequest.newPassword !==
      resetPasswordRequest.confirmNewPassword
    ) {
      throw new BadRequestException('Passwords do not match');
    }

    const existingUser = await this.prisma.user.findFirst({
      where: {
        passwordResetToken: resetPasswordRequest.resetPasswordToken,
      },
    });

    if (!existingUser) {
      throw new BadRequestException('User does not exist');
    }

    await this.prisma.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        password: await this.createPasswordHash(
          resetPasswordRequest.newPassword,
        ),
        passwordResetToken: '',
        forcePasswordChange: false,
      },
    });

    return { message: 'Password reset successfully' };
  }

  async getUserDetails(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: +userId,
      },
    });

    delete user.password;

    return user;
  }

  createPasswordHash = async (password: string) => {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);
    return hash;
  };
}
