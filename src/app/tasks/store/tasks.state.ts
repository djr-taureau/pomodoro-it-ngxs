import { AUTH_ROUTES } from './../../auth/auth.module';
import { Injectable, InjectionToken, Optional, Inject } from '@angular/core';
import { State, Action, StateContext, Selector, Actions, ofAction, ofActionDispatched } from '@ngxs/store';
import { Subject } from 'rxjs/Subject';
import { Task } from '../models/task';
import { Pomo } from '../models/pomo';
import * as task from '../store/task.actions';
import * as searchState from '../store/search.state';
import * as collection from '../store/collection.actions';
import { TodoistTasksService } from '../../services/todoist-tasks';
import { TaskService } from '../../services/task-service';
import { AuthService } from '../../auth/services/auth.service';
import { asapScheduler, of, Observable } from 'rxjs';
import { SelectTask } from './task.actions';


import {
  catchError, map, switchMap, toArray,
  mergeMap, debounceTime, takeUntil, skip, tap
} from 'rxjs/operators';

export const SEARCH_DEBOUNCE = new InjectionToken<number>('Search Debounce');
// export const SEARCH_SCHEDULER = new InjectionToken<Scheduler>(
//   'Search Scheduler'
// );
export class TaskStateModel {
  selectedTaskId: string;
  tasks: Task[];
}

// initial state
@State<TaskStateModel>({
  name: 'tasks',
  defaults: {
    selectedTaskId: null,
    tasks: []
  }
})

@Injectable()
export class TaskState {

  constructor(private todoist: TodoistTasksService,
    private auth: AuthService,
    private taskService: TaskService,
    private actions$: Actions) { }


  @Selector()
  static getSelectedTaskId(state: TaskStateModel) {
    return state.selectedTaskId;
  }

  @Selector()
  static getTasks(state: TaskStateModel) {
    return state.tasks;
  }

  @Action(task.LoadSearchTasks)
  selectTask(ctxTask: StateContext<TaskStateModel>, action: task.LoadSearchTasks) {
    const taskState = ctxTask.getState();
    ctxTask.setState({
      ...taskState,
      selectedTaskId: null,
      tasks: action.payload.map(tasks => tasks)
    });
  }


  @Action(task.Search)
  search(
    { patchState, dispatch }: StateContext<TaskStateModel>,
    { payload }
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












