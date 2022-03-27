import { Role } from '../roles/role.enum';

export type LoginResponse = {
  access_token: string;
};

export type JWTPayload = {
  id: number;
  username: string;
  nickname: string | null;
  roles: Role[];
};

export type JWTEncoded = JWTPayload & {
  iat: number;
  exp: number;
};
