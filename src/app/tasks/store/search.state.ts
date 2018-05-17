import { AUTH_ROUTES } from './../../auth/auth.module';
import { Injectable, InjectionToken, Optional, Inject } from '@angular/core';
import { State, Action, StateContext, Selector, Actions, ofAction, ofActionDispatched } from '@ngxs/store';
import { Subject } from 'rxjs/Subject';
import { Task } from '../models/task';
import * as TaskActions from '../store/task.actions';
import { TaskStateModel } from '../store/tasks.state';
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
import { query } from '@angular/animations';
import { TaskState } from '.';

export class SearchStateModel {
  ids: string[];
  query: string;
  loading: boolean;
  error: string;
}


@State<SearchStateModel>({
  name: 'search',
  defaults: {
    ids: [],
    query: '',
    loading: false,
    error: null,
  }
})

@Injectable()
export class SearchState {
  constructor(private todoist: TodoistTasksService,
    private auth: AuthService,
    private taskService: TaskService,
    private actions$: Actions) { }


  @Selector()
  static query(state: SearchStateModel) {
    return state.query;
  }

  @Selector()
  static getIds(state: SearchStateModel) {
    return state.ids;
  }

  @Action(TaskActions.Search)
  search(ctxSearch: StateContext<SearchStateModel>, action: task.Search) {
    // placeholder for now
    // return StateContext<>.dispatch(new TakeAnimalsOutside());
  }

  @Action(task.SearchComplete)
  searchComplete(ctxSearch: StateContext<SearchStateModel>, action: task.SearchComplete) {
   // setState({ids: payload.map(task => task.id), loading: false, query: '', error: ''});
   // const tasksLoad = action.payload;
   const searchState = ctxSearch.getState();
   ctxSearch.setState({
     ...searchState,
     ids: action.payload.map(task => task.id),
     loading: false,
     query: '',
     error: ''
   });
    return ctxSearch.dispatch(new task.LoadSearchTasks(action.payload));
  }

  @Action(task.LoadSearchTasks)
  loadSearchTasks(ctxTask: StateContext<TaskStateModel>, action: task.LoadSearchTasks) {
    const taskState = ctxTask.getState();
    ctxTask.setState({
      ...taskState,
      selectedTaskId: null,
      tasks: action.payload.map(tasks => tasks)
    });
  }

  // @Action(TaskActions.SearchComplete)
  // searchComplete({setState}: StateContext<SearchStateModel>, {payload}: TaskActions.SearchComplete) {
  //  setState({ids: payload.map(task => task.id), loaded: true, loading: false});
  // }

  // export const getSearchResults = createSelector(
  //   getTaskEntities,
  //   getSearchTaskIds,
  //   (tasks, searchIds) => {
  //     return searchIds.map(id => tasks[id]);
  //   }
  // );
  @Action(TaskActions.SearchError)
  SearchError(
    { patchState }: StateContext<SearchStateModel>,
    { payload }
  ) {
    patchState({ loading: false });
  }

}
