import { TaskStateModel } from './tasks.state';
import { AUTH_ROUTES } from './../../auth/auth.module';
import { Injectable, InjectionToken, Optional, Inject } from '@angular/core';
import { State, Action, StateContext, Selector, Actions, ofAction, ofActionDispatched } from '@ngxs/store';
import { Subject } from 'rxjs/Subject';
import { Task } from '../models/task';
import { Pomo } from '../models/pomo';
import * as taskActions from '../store/task.actions';
import * as collectionActions from '../store/collection.actions';
import { TodoistTasksService } from '../../services/todoist-tasks';
import { TaskService } from '../../services/task-service';
import { AuthService } from '../../auth/services/auth.service';
import { asapScheduler, of, Observable } from 'rxjs';

import {
  catchError, map, switchMap, toArray,
  mergeMap, debounceTime, takeUntil, skip, tap,
} from 'rxjs/operators';
import { state } from '@angular/animations';
import { AddTaskSuccess, AddTaskFail, LoadSuccess } from './collection.actions';

export class CollectionStateModel {
  loaded: boolean;
  loading: boolean;
  ids: string[];
}

@State<CollectionStateModel>({
  name: 'collection',
  defaults: {
    loaded: false,
    loading: false,
    ids: [],
  }
})

@Injectable()
export class CollectionState {
  constructor(private todoist: TodoistTasksService,
    private auth: AuthService,
    private taskService: TaskService,
    private actions$: Actions) { }



// @Selector()
// static getIds(state: CollectionStateModel) {
//   return state.ids;
// }

@Action(collectionActions.Load)
load({ setState, dispatch }: StateContext<CollectionStateModel>) {
   return this.taskService
     .getTasks$()
     .pipe(
       map((tasks: Task[]) =>
         asapScheduler.schedule(() =>
           dispatch(new collectionActions.LoadSuccess(tasks))
         )
       ),
       catchError(error =>
         of(
           asapScheduler.schedule(() =>
             dispatch(new collectionActions.LoadFail(error))
           )
         )
       )
     );
 }

 @Action(collectionActions.LoadSuccess)
  loadSuccess({ setState }: StateContext<CollectionStateModel>, { payload }: collectionActions.LoadSuccess ) {
    setState({ids: payload.map(task => task.id), loaded: true, loading: false});
 }

//  airlines = airlines.map(
//   (a: Airline) =>
//     a.id === payload.id ? payload : a
// );
// setState(airlines);

// case CollectionActionTypes.LoadSuccess: {
//   return {
//     loaded: true,
//     loading: false,
//     ids: action.payload.map(task => task.id),
//   };
// }
//  @Action(collectionActions.AddTask)
//   addTask(
//     { patchState, dispatch }: StateContext<CollectionStateModel>,
//     { payload }
//   ) {
//   patchState({ loading: true });
//    return this.taskService
//      .addTask$(payload)
//      .map((task: Task) =>
//          asapScheduler.schedule(() =>
//            dispatch(new collectionActions.AddTaskSuccess(task))
//          )
//        ),
//        catchError(error =>
//          of(
//            asapScheduler.schedule(() =>
//              dispatch(new collectionActions.AddTaskFail(task))
//            )
//          )
//      );
//  }

        // ofActionDispatched(collection.AddTask),
        // //map((task: string) => payload),
        // .switchMap(task => {
        //   const ref = this.afs.doc<Task>(`tasks/${task.selec}`)
        //   return Observable.fromPromise( ref.set(task)

  // $Action(collection.AddTaskSuccess)
  // AddTaskSuccess({});

  // $Action(collection.AddTaskFail)
  // AddTaskFail({});

  // $Action(collection.RemoveTask)
  // RemoveTask({});

  // $Action(collection.AddTaskSuccess)
  // AddTaskSuccess({});

  // $Action(collection.AddTaskFail)
  // AddTaskFail({});
}


