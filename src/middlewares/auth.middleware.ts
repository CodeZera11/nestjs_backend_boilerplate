import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';

import { Response, NextFunction, Request } from 'express';

import { IJwtPayload, verifyToken } from 'src/utils/jwt-utils';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Extract and verify the token logic goes here
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const token = req.headers['authorization'];

      if (token) {
        const payload: IJwtPayload | string = verifyToken(token);
        req.body.userId = parseInt(payload.userId.toString());
        req.body.role = payload.role;
        (req as any).userId = parseInt(payload.userId.toString());
        (req as any).role = payload.role;
      }
    } catch (err) {
      throw new UnauthorizedException(
        'Unauthorized: the provided token is invalid',
      );
    }

    next();
  }
}
