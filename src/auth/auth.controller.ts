import { Body, Controller, Get, Post, Req } from '@nestjs/common';

import { AuthService } from './auth.service';
import { SignInRequest } from './dto/sign-in-request.dto';
import { SignUpRequest } from './dto/sign-up-request.dto';
import { BaseRequest } from 'src/utils/BaseRequest';
import { ForgotPasswordRequest } from './dto/forgot-password-request.dto';
import { ResetPasswordRequest } from './dto/reset-password-request.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-in')
  signIn(@Body() signInRequest: SignInRequest) {
    return this.authService.signIn(signInRequest);
  }

  @Post('sign-up')
  signUp(@Body() signInRequest: SignUpRequest) {
    return this.authService.signUp(signInRequest);
  }

  @Post('forgot-password')
  forgotPassword(@Body() forgotPassword: ForgotPasswordRequest) {
    return this.authService.forgotPassword(forgotPassword);
  }

  @Post('reset-password')
  resetPassword(@Body() resetPassword: ResetPasswordRequest) {
    return this.authService.resetPassword(resetPassword);
  }

  @Get('user')
  getUser(@Req() req: BaseRequest) {
    return this.authService.getUserDetails(+req.userId);
  }

  // @Get('reset-password/:email')
  // async forgotPassword(@Param('email') email: string) {
  //   const forgotPasswordLink = await this.authService.generatePasswordResetLink(email);

  //   return forgotPasswordLink;
  // }
}
