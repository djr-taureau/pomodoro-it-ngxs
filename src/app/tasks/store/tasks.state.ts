import { AUTH_ROUTES } from './../../auth/auth.module';
import { Injectable, InjectionToken, Optional, Inject } from '@angular/core';
import { State, Action, StateContext, Selector, Actions, ofAction, ofActionDispatched } from '@ngxs/store';
import { Subject } from 'rxjs/Subject';
import { Task } from '../models/task';
import { Pomo } from '../models/pomo';
import * as task from '../store/task.actions';
import { TodoistTasksService } from '../../services/todoist-tasks';
import { TaskService } from '../../services/task-service';
import { AuthService } from '../../auth/services/auth.service';
import { asapScheduler, of, Observable } from 'rxjs';

import {
  catchError, map, switchMap, toArray,
  mergeMap, debounceTime, takeUntil, skip, tap
} from 'rxjs/operators';

export const SEARCH_DEBOUNCE = new InjectionToken<number>('Search Debounce');
//export const SEARCH_SCHEDULER = new InjectionToken<Scheduler>('Search Scheduler');

export class TaskStateModel {
  loadedTasks: boolean;
  loadingTasks: boolean;
  tasks: Task[];
  selectedTaskId: string;
  query: string;
  // loadingSearchTasks: boolean;
  error: string;
}

// initial state
@State<TaskStateModel>({
  name: 'tasks',
  defaults: {
    loadedTasks: false,
    loadingTasks: false,
    tasks: [],
    selectedTaskId: null,
    query: '',
    // loadingSearchTasks: false,
    error: null,
  }
})

@Injectable()
export class TaskState {

  constructor(private todoist: TodoistTasksService,
    private auth: AuthService,
    @Optional()
    @Inject(SEARCH_DEBOUNCE)
    private debounce: number,
    private taskService: TaskService,
    private actions$: Actions) { }


  @Selector()
  static query(state: TaskStateModel) {
    return state.query;
  }

  @Selector()
  static getTasks(state: TaskStateModel) {
    return state.tasks;
  }

  @Selector()
  static loadedTasks(state: TaskStateModel) {
    return state.loadedTasks;
  }

  @Selector()
  static getSelectedTaskId(state: TaskStateModel) {
    return state.selectedTaskId;
  }

  @Selector()
  static loadingTasks(state: TaskStateModel) {
    return state.loadingTasks;
  }


  @Selector()
  static error(state: TaskStateModel) {
    return state.error;
  }

  @Selector()
  static SelectTask(state: TaskStateModel): Task {
    return state.tasks.find(
      (task: Task) => task.id === state.selectedTaskId
    );
  }


  @Action(task.Search)
  search(
    { patchState, dispatch }: StateContext<TaskStateModel>,
    { payload }
  ) {
    patchState({ loadingTasks: true });
    const nextSearch$ = this.actions$.pipe(ofActionDispatched(task.Search), skip(1));
    return this.todoist
      .searchTasks(payload)
      .pipe(
        takeUntil(nextSearch$),
        map((tasks: Task[]) =>
          asapScheduler.schedule(() =>
            dispatch(new task.SearchComplete(tasks))
          )
        ),
        catchError(error =>
          of(
            asapScheduler.schedule(() =>
              dispatch(new task.SearchError(error))
            )
          )
        )
      );
  }

  @Action(task.SearchComplete)
  SearchComplete(
    { patchState }: StateContext<TaskStateModel>,
    { payload }: task.SearchComplete
  ) {
    patchState({ tasks: payload, loadingTasks: false });
    dispatch(new task.Load());
  }

  @Action(task.SearchError)
  SearchError(
    { patchState }: StateContext<TaskStateModel>,
    { payload }: task.SearchError
  ) {
    patchState({ loadingTasks: false });
  }

  @Action(task.Load)
  load({ patchState, dispatch }: StateContext<TaskStateModel>) {
   patchState({ loadingTasks: true });
    return this.taskService
      .getTasks$()
      .pipe(
        map((tasks: Task[]) =>
          asapScheduler.schedule(() =>
            dispatch(new task.LoadTaskSuccess(tasks))
          )
        ),
        catchError(error =>
          of(
            asapScheduler.schedule(() =>
              dispatch(new task.LoadTaskFail(error))
            )
          )
        )
      );
  }

    @Action(task.LoadTaskSuccess)
    loadTaskSuccess(
      { patchState }: StateContext<TaskStateModel>,
      { payload }: task.LoadTaskSuccess
    ) {
      patchState({ tasks: payload, loadedTasks: true});
    }

    @Action(task.LoadTaskFail)
    loadTaskFail(
      { dispatch }: StateContext<TaskStateModel>,
      { payload }: task.LoadTaskFail
    ) {
      dispatch({ loaded: false });
    }

    @Action(task.SelectTask)
    SelectTask(
      { patchState }: StateContext<TaskStateModel>,
      { payload }: task.SelectTask
    ) {
      patchState({ selectedTaskId: payload });
    }





}












