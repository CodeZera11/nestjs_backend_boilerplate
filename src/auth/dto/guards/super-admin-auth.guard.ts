import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserRoleEnum } from '@prisma/client';
import { verifyToken } from 'src/utils/jwt-utils';

@Injectable()
export class SuperAdminAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      return false;
    }

    const payload: any = verifyToken(authHeader);

    if (payload.role === UserRoleEnum.SUPER_ADMIN) {
      return true;
    }

    return false;
  }
}
