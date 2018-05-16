export interface Authenticate {
  uid?: string;
  email?: string;
  photoURL?: string;
  displayName?: string;
  username?: string;
  password?: string;
  code?: string;
  state?: string;
  accessKey?: string;
}

import { UserInfo } from 'firebase';

export type User = UserInfo;

export interface AuthStateModel {
  user?: User;
  loggedIn: boolean;
}
