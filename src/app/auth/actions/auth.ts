import { Action } from '@ngrx/store';
import { User, Authenticate } from '../models/user';

export enum AuthActionTypes {
  Login = '[Auth] Login',
  TodoistRedirect = '[Auth-Todist] Login Redirect',
  TodoistLogin = '[Auth-Todoist] Login',
  TodoistLoginSuccess = '[Auth-Todoist] LoginSuccess',
  Logout = '[Auth] Logout',
  LoginSuccess = '[Auth] Login Success',
  LoginFailure = '[Auth] Login Failure',
  LoginRedirect = '[Auth] Login Redirect',
}

export class Login implements Action {
  readonly type = AuthActionTypes.Login;

  constructor(public payload: Authenticate) {}
}

export class TodoistLogin implements Action {
  readonly type = AuthActionTypes.TodoistLogin;

  constructor(public payload: Authenticate) {}
}

export class LoginSuccess implements Action {
  readonly type = AuthActionTypes.LoginSuccess;

  constructor(public payload: { user: User }) {}
}

export class TodoistLoginSuccess implements Action {
  readonly type = AuthActionTypes.TodoistLoginSuccess;

  constructor(public payload: { user: User }) {}
}

export class LoginFailure implements Action {
  readonly type = AuthActionTypes.LoginFailure;

  constructor(public payload: any) {}
}
export class TodoistRedirect implements Action {
  readonly type = AuthActionTypes.TodoistRedirect;
}
export class LoginRedirect implements Action {
  readonly type = AuthActionTypes.LoginRedirect;
}

export class Logout implements Action {
  readonly type = AuthActionTypes.Logout;
}

export type AuthActions =
  | Login
  | TodoistRedirect
  | TodoistLogin
  | TodoistLoginSuccess
  | LoginSuccess
  | LoginFailure
  | LoginRedirect
  | Logout;
