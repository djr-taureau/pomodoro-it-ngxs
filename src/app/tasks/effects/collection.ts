import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Database } from '@ngrx/db';
import { Observable } from 'rxjs/Observable';
import { defer } from 'rxjs/observable/defer';
import { of } from 'rxjs/observable/of';
import { Load } from './../actions/Task';

import {
  CollectionActions,
  LoadFail,
  LoadSuccess,
  AddTaskSuccess,
  AddTaskFail,
  CollectionActionTypes,
  RemoveTask,
  RemoveTaskFail,
  RemoveTaskSuccess,
  AddTask,
} from './../actions/collection';
import { Task } from '../models/Task';
import { switchMap, toArray, map, catchError, mergeMap } from 'rxjs/operators';
//import { CollectionActions } from '../../tasks__/actions/collection';

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
    return this.db.open('Tasks_app');
  });

  @Effect()
  loadCollection$: Observable<Action> = this.actions$.pipe(
    ofType(CollectionActionTypes.Load),
    switchMap(() =>
      this.db
        .query('Tasks')
        .pipe(
          toArray(),
          map((tasks: Task[]) => new LoadSuccess(tasks)),
          catchError(error => of(new LoadFail(error)))
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
