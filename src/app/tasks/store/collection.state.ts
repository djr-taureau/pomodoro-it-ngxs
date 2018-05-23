import { ApplicationRef } from '@angular/core';
import { TaskStateModel } from './tasks.state';
import { State, NgxsOnInit, Action, StateContext, Selector, Actions, ofAction, ofActionDispatched } from '@ngxs/store';
import { Task } from '../models/task';
import { Pomo } from '../models/pomo';
import * as taskActions from '../store/task.actions';
import * as collectionActions from '../store/collection.actions';
import { TodoistTasksService } from '../../services/todoist-tasks';
import { TaskService } from '../../services/task-service';
import { asapScheduler, of, Observable } from 'rxjs';
import {
  catchError, map, switchMap, toArray,
  mergeMap, debounceTime, takeUntil, skip, tap,
} from 'rxjs/operators';
import { state } from '@angular/animations';
import { AddTaskSuccess, AddTaskFail, LoadSuccess, Load } from './collection.actions';
export class CollectionStateModel {
  loaded: boolean;
  loading: boolean;
  collection: Task[];
}
@State<CollectionStateModel>({
  name: 'collection',
  defaults: {
    loaded: true,
    loading: false,
    collection: [],
  }
})


export class CollectionState implements NgxsOnInit {
  constructor(private todoist: TodoistTasksService,
    private appRef: ApplicationRef,
    private taskService: TaskService,
    private actions$: Actions) { }


@Selector()
static Loaded(ctx: CollectionStateModel) {
  return ctx.loaded;
}

@Selector()
  static Loading(ctx: CollectionStateModel) {
    return ctx.loading;
  }

@Selector()
  static Collection(ctx: CollectionStateModel) {
  return ctx.collection;
}

ngxsOnInit(sc: StateContext<CollectionStateModel>) {
  sc.dispatch(new Load());
}

@Action(Load)
load({ setState, dispatch }: StateContext<CollectionStateModel>) {
  setState({collection: [], loading: true, loaded: false});
   return this.taskService
     .getTasks$()
     .pipe(
       map((tasks: Task[]) =>
       asapScheduler.schedule(() =>
           dispatch([
             new collectionActions.LoadSuccess(tasks),
             // new taskActions.LoadTasks(tasks)
            ])
         )
       ),
       catchError(error =>
         of(
           asapScheduler.schedule(() =>
             dispatch(new collectionActions.LoadFail(error))
           )
         )
       ),
     );
 }

//  @Action(LoadCollection)
// loadCollection({ setState, dispatch }: StateContext<CollectionStateModel>) {
//   setState({collectionIds: [], loading: true, loaded: false});
//    return this.taskService
//      .getTasks$()
//      .pipe(
//        map((tasks: Task[]) =>
//          asapScheduler.schedule(() =>
//            dispatch(new collectionActions.LoadSuccess(tasks)),
//          )
//        ),
//        catchError(error =>
//          of(
//            asapScheduler.schedule(() =>
//              dispatch(new collectionActions.LoadFail(error))
//            )
//          )
//        )
//      );
//  }

 @Action(collectionActions.LoadSuccess)
  loadSuccess({ setState }: StateContext<CollectionStateModel>, { payload }: collectionActions.LoadSuccess ) {
    setState({collection: payload.map(task => task), loaded: true, loading: false});
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

