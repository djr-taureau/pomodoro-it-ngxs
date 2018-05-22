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
  collection: Task[];
}
@State<CollectionStateModel>({
  name: 'collection',
  defaults: {
    loaded: true,
    loading: false,
    collectionIds: [],
    collection: []
  }
})

@Injectable()
export class CollectionState {
  constructor(private todoist: TodoistTasksService,
    private auth: AuthService,
    private taskService: TaskService,
    private actions$: Actions) { }




@Selector()
static Loaded(ctx: StateContext<CollectionStateModel>) {
  return ctx.loaded;
}

@Selector()
  static Loading(ctx: CollectionStateModel) {
    return ctx.loading;
  }

@Selector()
  static CollectionIds(ctx: CollectionStateModel) {
  return ctx.collectionIds;
}

@Selector()
  static Collection(ctx: CollectionStateModel) {
  return ctx.collection;
}

ngxsOnInit(sc: StateContext<CollectionStateModel>) {}

@Action(collectionActions.Load)
load({ setState, dispatch }: StateContext<CollectionStateModel>) {
  setState({collectionIds: [], collection: [], loading: true, loaded: false});
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
    setState({collectionIds: payload.map(task => task.id), collection: payload.map(task => task), loaded: true, loading: false});
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

  @Action(collectionActions.RemoveTask)
  removeTask(
    { patchState, dispatch }: StateContext<CollectionStateModel>,
    { payload }
  ) {
  // patchState({ loading: true });
  //  return Observable.fromPromise(this.taskService.removeTask(payload));
  // }



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


