import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
// import { firebaseAdminAuth } from 'src/utils/firebase-admin-auth';
import { verifyToken } from 'src/utils/jwt-utils';

@Injectable()
export class BasicAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      return false;
    }

    verifyToken(authHeader);

    return true;
  }
}
