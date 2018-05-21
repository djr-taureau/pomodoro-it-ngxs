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
import { AppState, TaskState } from '../store';
import {
  catchError, map, switchMap, toArray,
  mergeMap, debounceTime, takeUntil, skip, tap,
} from 'rxjs/operators';
import { state } from '@angular/animations';
import { AddTaskSuccess, AddTaskFail, LoadSuccess } from './collection.actions';
export class CollectionStateModel {
  loaded: boolean;
  loading: boolean;
  collectionIds: string[];
}
@State<CollectionStateModel>({
  name: 'collection',
  defaults: {
    loaded: true,
    loading: false,
    collectionIds: [],
  }
})

@Injectable()
export class CollectionState {
  constructor(private todoist: TodoistTasksService,
    private auth: AuthService,
    private taskService: TaskService,
    private actions$: Actions) { }

@Selector()
static Loaded(state: CollectionStateModel) {
  return state.loaded;
}

@Selector()
  static Loading(state: CollectionStateModel) {
    return state.loading;
  }

@Selector()
  static CollectionIds(state: CollectionStateModel) {
  return state.collectionIds;
}

@Action(collectionActions.Load)
load({ setState, dispatch }: StateContext<CollectionStateModel>) {
  setState({collectionIds: [], loading: true, loaded: false});
   return this.taskService
     .getTasks$()
     .pipe(
       map((tasks: Task[]) =>
         asapScheduler.schedule(() =>
           dispatch(new collectionActions.LoadSuccess(tasks)),
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
    setState({collectionIds: payload.map(task => task.id), loaded: true, loading: false});
 }

 @Action(collectionActions.LoadFail)
 loadFail({ patchState }: StateContext<CollectionStateModel>, { payload }: collectionActions.LoadSuccess ) {
   patchState({loaded: false, loading: false});
}

 @Action(collectionActions.AddTask)
  addTask(
    { patchState, dispatch }: StateContext<CollectionStateModel>,
    { payload }
  ) {
  patchState({ loading: true });
   return Observable.fromPromise(this.taskService.addTask(payload));
  }

  // @Action(collectionActions.RemoveTask)
  // removeTask(
  //   { patchState, dispatch }: StateContext<CollectionStateModel>,
  //   { payload }
  // ) {
  // patchState({ loading: false });
  //  return Observable.fromPromise(this.taskService.removeTask$(payload));
  // }

  // .map((action: userActions.GoogleLogin) => action.payload)
  // .switchMap(payload => {
  //     return Observable.fromPromise( this.googleLogin() );
  // })
  // .map( credential => {
  //     // successful login
  //     return new userActions.GetUser();
  // })
  // .catch(err => {
  //     return Observable.of(new userActions.AuthError({error: err.message}));
  // });

//         // ofActionDispatched(collection.AddTask),
//         // //map((task: string) => payload),
//         // .switchMap(task => {
//         //   const ref = this.afs.doc<Task>(`tasks/${task.selec}`)
//         //   return Observable.fromPromise( ref.set(task)

  // @Action(collectionActions.AddTaskSuccess)
  //   addTaskSuccess({ setState }: StateContext<CollectionStateModel>, { payload }: collectionActions.AddTaskSuccess ) {
  //     setState({ids: payload.map(task => task.id), loaded: true, loading: false});
  // }

  // $Action(collection.AddTaskFail)
  // AddTaskFail({});

  // $Action(collection.RemoveTask)
  // RemoveTask({});

  // $Action(collection.AddTaskSuccess)
  // AddTaskSuccess({});

  // $Action(collection.AddTaskFail)
  // AddTaskFail({});
}


