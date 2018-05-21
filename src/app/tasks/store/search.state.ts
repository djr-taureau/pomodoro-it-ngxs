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
//
export class SearchStateModel {
  searchIds: string[];
  query: string;
  loading: boolean;
  error: string;
}


@State<SearchStateModel>({
  name: 'search',
  defaults: {
    searchIds: [],
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
  static Query(state: SearchStateModel) {
    return state.query;
  }

  @Selector()
  static SearchIds(state: SearchStateModel) {
    return state.searchIds;
  }

  @Selector()
  static Loading(state: SearchStateModel) {
    return state.loading;
  }

  @Selector()
  static Error(state: SearchStateModel) {
    return state.error;
  }

  @Action(task.Search)
  search(ctxSearch: StateContext<SearchStateModel>, action: task.Search) {
   const searchState = ctxSearch.getState();
   const queryText = action.payload;
     ctxSearch.setState({
       ...searchState,
       searchIds: [],
       loading: true,
       query: action.payload,
       error: ''
     });
    // return ctxSearch.dispatch(new task.LoadTasks(action.payload));
  }

  @Action(task.SearchComplete)
  searchComplete(ctxSearch: StateContext<SearchStateModel>, action: task.SearchComplete) {
   const searchState = ctxSearch.getState();
   ctxSearch.setState({
     ...searchState,
     searchIds: action.payload.map(a => a.id),
     loading: false,
     query: searchState.query,
     error: ''
   });
    ctxSearch.dispatch(new task.LoadTasks(action.payload));
  }

  @Action(TaskActions.SearchError)
  SearchError(
    { patchState }: StateContext<SearchStateModel>,
    { payload }
  ) {
    patchState({ loading: false });
  }

}
