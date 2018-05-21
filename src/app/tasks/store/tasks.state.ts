import { AUTH_ROUTES } from './../../auth/auth.module';
import { Injectable, InjectionToken, Optional, Inject } from '@angular/core';
import { State, Action, StateContext, Selector, Actions, ofAction, ofActionDispatched } from '@ngxs/store';
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
import { SelectTask, LoadTask } from './task.actions';


import {
  catchError, map, switchMap, toArray,
  mergeMap, debounceTime, takeUntil, skip, tap
} from 'rxjs/operators';
import { isThisTypeNode } from 'typescript';

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
  static SelectedTaskId(state: TaskStateModel) {
    return state.selectedTaskId;
  }

  @Selector()
  static Tasks(state: TaskStateModel) {
    return state.tasks;
  }

  @Action(task.LoadTasks)
  loadTasks(ctxTask: StateContext<TaskStateModel>, action: task.LoadTasks) {
    const taskState = ctxTask.getState();
    ctxTask.setState({
      ...taskState,
      selectedTaskId: null,
      tasks: action.payload.map(tasks => tasks)
    });
  }

  @Action(task.SelectTask)
  selectTask(ctxTask: StateContext<TaskStateModel>, action: task.SelectTask) {
    const taskState = ctxTask.getState();
    ctxTask.patchState({
      selectedTaskId: action.payload,
    });
    // return taskState.tasks.map(tasks => tasks[taskState.selectedTaskId]);
  }

  @Action(task.LoadTask)
  loadTask(ctxTask: StateContext<TaskStateModel>, action: task.LoadTask) {
    const taskState = ctxTask.getState();
    return taskState.tasks.filter(tasks => tasks[taskState.selectedTaskId])
      .map((tasks: Task) => Task);
    // return taskState.tasks.map(tasks  => tasks.filter(task => task.id === taskState.sel))
    }

  // export const getSelectedTask = createSelector(
  //   getTaskEntities,
  //   getSelectedTaskId,
  //   (entities, selectedId) => {
  //     return selectedId && entities[selectedId];
  //   }
  // );

    // this
  //   return this.store.select(TaskState.Tasks).pipe(
  //     map((tasks: Task[]) => tasks.filter(task => task.id === id)),
  //     switchMap(task => {
  //       if (!!task) {
  //         return this.store
  //           .dispatch(new LoadTask(Task))
  //           .pipe(switchMap(() => of(true)));
  //       }
  //       return of(false);
  //     })
  //   );
  // }

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












