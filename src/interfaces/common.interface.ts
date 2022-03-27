import { JWTPayload } from '../auth/auth.interfaces';

export interface IRequest extends Request {
  user: JWTPayload;
}
