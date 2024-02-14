import { UserRoleEnum } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
const secretKey = process.env.SECRET_KEY || 'purpleroof-secret-key';

export interface IJwtPayload extends jwt.JwtPayload {
  userId: number;
  userAuthId: string;
  username: string;
  email: string;
  role: UserRoleEnum;
  forcePasswordChange?: boolean;
}

// Method to generate a JWT token
export const generateToken = (payload: IJwtPayload): string => {
  const options = { expiresIn: '30d' };

  // Sign the token with the secret key
  const token = jwt.sign(payload, secretKey, options);

  return token;
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, secretKey) as IJwtPayload;
};
