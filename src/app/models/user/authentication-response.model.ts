import { User } from './user.model';

export interface AuthenticationResponse {
  token: string;
  user: User;
}
