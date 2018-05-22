import { AUTH_ROUTES } from './../../auth/auth.module';
import { Injectable, InjectionToken, Optional, Inject } from '@angular/core';
import { State, Action, StateContext, Selector, Actions, ofAction,
  ofActionDispatched, NgxsOnInit } from '@ngxs/store';
import { Subject } from 'rxjs/Subject';
import { Task } from '../models/task';
import { Pomo } from '../models/pomo';
import * as task from '../store/task.actions';
import { AppState } from '../store';
import * as collection from '../store/collection.actions';
import { TodoistTasksService } from '../../services/todoist-tasks';
import { TaskService } from '../../services/task-service';
import { AuthService } from '../../auth/services/auth.service';
import { asapScheduler, of, Observable } from 'rxjs';
import { SelectTask, LoadTask, LoadTasks } from './task.actions';

import {
  catchError, map, switchMap, toArray,
  mergeMap, debounceTime, takeUntil, skip, tap
} from 'rxjs/operators';

import { isThisTypeNode } from 'typescript';

export const SEARCH_DEBOUNCE = new InjectionToken<number>('Search Debounce');
// export const SEARCH_SCHEDULER = new InjectionToken<Scheduler>(
//   'Search Scheduler'
// )
// initial state
@State<Task[]>({
  name: 'tasks',
    defaults: []
})

@Injectable()
export class TaskState {

  constructor(private todoist: TodoistTasksService,
    private auth: AuthService,
    private taskService: TaskService,
    private actions$: Actions) { }

   @Selector()
  static Tasks(state: StateContext<Task[]>) {
    return state;
  }

  @Action(LoadTasks)
    loadTasks({getState, setState}: StateContext<Task[]>, {payload}: LoadTasks) {
    const taskState = getState();
    const tasks = payload.map(t => t);
    setState(tasks);
  }

  @Action(LoadTask)
  loadTask({getState, setState}: StateContext<Task[]>, {payload}: LoadTask) {
    let tasks = getState();
    tasks = tasks.filter(
      (t: Task) => t.id === payload.id ? payload : t
    );
    setState(tasks);
  }

  @Action(SelectTask)
  selectTask({getState, setState, patchState}: StateContext<Task[]>, {payload}: SelectTask) {
    let tasks = getState();
    // tasks = [];
    tasks = tasks.filter(
      (t: Task) => payload === t.id.toString());
    setState(tasks);
  }

  @Action(task.Search)
  search({ patchState, dispatch }: StateContext<Task[]>, { payload }: task.Search
  ) {
    patchState({});
    const nextSearch$ = this.actions$.pipe(ofActionDispatched(task.Search), skip(1));
    return this.todoist
      .searchTasks(payload)
      .pipe(
        debounceTime(300),
        takeUntil(nextSearch$),
        map((tasks: Task[]) =>
          asapScheduler.schedule(() =>
            dispatch(new task.SearchComplete(tasks))
          )
        ),
        catchError(error =>
          of(
            asapScheduler.schedule(() =>
              dispatch(new task.SearchError())
            )
          )
        )
      );
  }

}












