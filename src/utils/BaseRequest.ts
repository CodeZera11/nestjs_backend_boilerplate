import { UserRoleEnum } from '@prisma/client';

export class BaseRequest {
  userId: number;
  role: UserRoleEnum;
}
