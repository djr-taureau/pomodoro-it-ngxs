export interface Authenticate {
  username: string;
  password: string;
  code?: string;
  state?: string;
  accessKey?: string;
}

export interface User {
  name: string;
  state?: string;
  accessKey?: string;
}
