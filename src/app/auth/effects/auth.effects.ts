import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { tap, map, exhaustMap, catchError } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';
import {
  Login,
  TodoistLogin,
  TodoistLoginSuccess,
  LoginSuccess,
  LoginFailure,
  AuthActionTypes,
} from '../actions/auth';
import { User, Authenticate } from '../models/user';

@Injectable()
export class AuthEffects {
  @Effect()
  login$ = this.actions$.pipe(
    ofType(AuthActionTypes.Login),
    map((action: Login) => action.payload),
    exhaustMap((auth: Authenticate) =>
      this.authService
        .login(auth)
        .pipe(
          map(user => new LoginSuccess({ user })),
          catchError(error => of(new LoginFailure(error)))
        )
    )
  );

  @Effect()
  Todoistlogin$ = this.actions$.pipe(
    ofType(AuthActionTypes.Login),
    map((action: TodoistLogin) => action.payload),
    exhaustMap((auth: Authenticate) =>
      this.authService
        .todoistLogin(auth)
        .pipe(
          map(user => new TodoistLoginSuccess({ user })),
          catchError(error => of(new LoginFailure(error)))
        )
    )
  );


  @Effect({ dispatch: false })
  loginSuccess$ = this.actions$.pipe(
    ofType(AuthActionTypes.LoginSuccess),
    tap(() => this.router.navigate(['/']))
  );

  @Effect({ dispatch: false })
  TodoistLoginSuccess$ = this.actions$.pipe(
    ofType(AuthActionTypes.TodoistLoginSuccess),
    tap(() => this.router.navigate(['/']))
  );

  @Effect({ dispatch: false })
  loginRedirect$ = this.actions$.pipe(
    ofType(AuthActionTypes.LoginRedirect, AuthActionTypes.Logout),
    tap(authed => {
      this.router.navigate(['/login']);
    })
  );

  @Effect({ dispatch: false })
  TodoisRedirect$ = this.actions$.pipe(
    ofType(AuthActionTypes.TodoistRedirect, AuthActionTypes.Logout),
    tap(authed => {
      this.router.navigateByUrl(`${this.authService.oAuthUrl}`);
    })
  );

  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) {}
}
