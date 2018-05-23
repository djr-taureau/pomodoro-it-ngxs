
import { CheckSession } from './../../auth/auth.actions';
import { Observable } from 'rxjs/Observable';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import * as layout from '../actions/layout.actions';
import * as auth from '../../auth/auth.actions';
import { State, Action , StateContext } from '@ngxs/Store';
import { AuthState } from '../../auth/auth.state';

@Component({
  selector: 'bc-app',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <bc-layout>
      <bc-sidenav [open]="showSidenav">
      <bc-nav-item (navigate)="closeSidenav()"
          *ngIf="loggedIn$ | async"
          routerLink="/tasks"
          icon="assignment"
          hint="View your task collection">
            My Task Collection
      </bc-nav-item>
      <bc-nav-item (navigate)="closeSidenav()"
        *ngIf="loggedIn$ | async" routerLink="/tasks/find"
        icon="search" hint="Find your next task!">
            Find Tasks
      </bc-nav-item>
      <bc-nav-item (navigate)="closeSidenav()"
        *ngIf="loggedIn$ | async" routerLink="/tasks"
        icon="alarm" hint="View your Dashboard">
            View My Task Pomodoro Dashboard
      </bc-nav-item>
        <bc-nav-item (navigate)="closeSidenav()"
          *ngIf="!(loggedIn$ | async)" routerLink="/auth/login">
          Sign In
        </bc-nav-item>
        <bc-nav-item (navigate)="logout()"
          *ngIf="loggedIn$ | async" routerLink="/SignOut">
            Sign Out
        </bc-nav-item>
      </bc-sidenav>
      <bc-toolbar (openMenu)="openSidenav()">
          Pomodo-it
      </bc-toolbar>

      <router-outlet></router-outlet>
    </bc-layout>
  `,
})
export class AppComponent  {
  showSidenav;
  loggedIn$;

  constructor(private store: Store) {
    this.loggedIn$ = this.store.select(state => state.AuthState);
  }

  closeSidenav() {
    this.showSidenav = false;
  }

  openSidenav() {
    this.showSidenav = true;
  }

  logout() {
    this.closeSidenav();
    this.store.dispatch(new auth.Logout());
  }
}
