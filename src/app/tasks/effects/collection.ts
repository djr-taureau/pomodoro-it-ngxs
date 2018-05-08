import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Database } from '@ngrx/db';
import { Observable } from 'rxjs/Observable';
import { defer } from 'rxjs/observable/defer';
import { of } from 'rxjs/observable/of';
import { Load } from './../actions/task';
import {
  CollectionActions,
  LoadFail,
  LoadPomos,
  LoadPomosSuccess,
  LoadPomosFail,
  LoadSuccess,
  AddTaskSuccess,
  AddTaskFail,
  CollectionActionTypes,
  RemoveTask,
  RemoveTaskFail,
  RemoveTaskSuccess,
  AddTask,
} from './../actions/collection';
import { Task } from '../models/task';
import { Pomo } from '../models/pomo';
import { switchMap, toArray, map, catchError, mergeMap } from 'rxjs/operators';

@Injectable()
export class CollectionEffects {
  /**
   * This effect does not yield any actions back to the store. Set
   * `dispatch` to false to hint to @ngrx/effects that it should
   * ignore any elements of this effect stream.
   *
   * The `defer` observable accepts an observable factory function
   * that is called when the observable is subscribed to.
   * Wrapping the database open call in `defer` makes
   * effect easier to test.
   */
  @Effect({ dispatch: false })
  openDB$: Observable<any> = defer(() => {
    return this.db.open('tasks_app');
  });

  @Effect()
  loadCollection$: Observable<Action> = this.actions$.pipe(
    ofType(CollectionActionTypes.Load),
    switchMap(() =>
      this.db
        .query('tasks')
        .pipe(
          toArray(),
          map((tasks: Task[]) => new LoadSuccess(tasks)),
          catchError(error => of(new LoadFail(error)))
        )
    )
  );

  @Effect()
  loadPomos$: Observable<Action> = this.actions$.pipe(
    ofType(CollectionActionTypes.LoadPomos),
    switchMap(() =>
      this.db
        .query('pomos')
        .pipe(
          toArray(),
          map((pomos: Pomo[]) => new LoadPomosSuccess(pomos)),
          catchError(error => of(new LoadPomosFail(error)))
        )
    )
  );

  @Effect()
  addTaskToCollection$: Observable<Action> = this.actions$.pipe(
    ofType(CollectionActionTypes.AddTask),
    map((action: AddTask) => action.payload),
    mergeMap(task =>
      this.db
        .insert('tasks', [task])
        .pipe(
          map(() => new AddTaskSuccess(task)),
          catchError(() => of(new AddTaskFail(task)))
        )
    )
  );

  @Effect()
  removeTaskFromCollection$: Observable<Action> = this.actions$.pipe(
    ofType(CollectionActionTypes.RemoveTask),
    map((action: RemoveTask) => action.payload),
    mergeMap(task =>
      this.db
        .executeWrite('tasks', 'delete', [task.id])
        .pipe(
          map(() => new RemoveTaskSuccess(task)),
          catchError(() => of(new RemoveTaskFail(task)))
        )
    )
  );

  constructor(private actions$: Actions, private db: Database) {}
}
