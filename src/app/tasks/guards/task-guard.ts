import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { catchError, switchMap, take } from 'rxjs/operators';
import { LoadTask, SelectTask, AddTask, Load } from '../store';
import { AppState } from './../store/index';

@Injectable()
export class TaskGuard implements CanActivate {
  tasksLoaded$: Observable<boolean>;

  constructor(private store: Store) {}
  canActivate(): Observable<boolean> {
    return this.checkStore().pipe(
      switchMap(() => of(true)),
      catchError(() => of(false))
    );
  }

  checkStore(): Observable<boolean> {
    return this.store.select(state => state.taskState.loaded).pipe(
      switchMap((loaded: boolean) => {
        if (!loaded) {
          return this.store.dispatch(new Load());
        }
        return of(true);
      }),
      take(1)
    );
  }
}
