import { OpenSidenav, CloseSidenav  } from '../core/actions/layout.actions';
import { Action, Selector, State, StateContext, Store, NgxsOnInit } from '@ngxs/store';
import { Navigate } from '@ngxs/router-plugin';
import { take, tap } from 'rxjs/operators';
import { ApplicationRef } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthService } from '../auth/services/auth.service';
import { CheckSession } from '../auth/auth.actions';



export interface LayoutStateModel {
  showSidenav: boolean;
}

@State<LayoutStateModel>({
  name: 'layout',
  defaults: {
    showSidenav: false
  }
})

export class LayoutState implements NgxsOnInit {
  constructor(private store: Store,
              private ref: ApplicationRef,
              private afAuth: AngularFireAuth) {}

  @Selector()
  static showSidenav(state: LayoutStateModel) {
    return state.showSidenav;
  }

  ngxsOnInit(sc: StateContext<LayoutStateModel>) {}

  @Action(OpenSidenav)
  openSidenav(state: LayoutStateModel) {
      return state.showSidenav = true;
  }

  @Action(CloseSidenav)
  closeSidenav(state: LayoutStateModel) {
    return state.showSidenav = false;
  }

}

