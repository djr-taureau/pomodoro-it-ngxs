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

export interface User {
  name: string;
  state?: string;
  accessKey?: string;
}
