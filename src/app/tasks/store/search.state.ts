
import { AUTH_ROUTES } from './../../auth/auth.module';
import { Injectable, InjectionToken, Optional, Inject } from '@angular/core';
import { State, Action, StateContext, Selector, Actions, ofAction, ofActionDispatched } from '@ngxs/store';
import { Subject } from 'rxjs/Subject';
import { Task } from '../models/task';
import * as TaskActions from '../store/task.actions'
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

export const SEARCH_DEBOUNCE = new InjectionToken<number>('Search Debounce');

export class SearchStateModel {
  searchTasks: string[];
  query: string;
  loading: boolean;
  error: string;
}


@State<SearchStateModel>({
  name: 'search',
  defaults: {
    searchTasks: [],
    query: '',
    loading: false,
    error: null,
  }
})

@Injectable()
export class SearchState {
  constructor(private todoist: TodoistTasksService,
    private auth: AuthService,
    @Optional()
    @Inject(SEARCH_DEBOUNCE)
    private debounce: number,
    private taskService: TaskService,
    private actions$: Actions) { }


  @Selector()
  static query(state: SearchStateModel) {
    return state.query;
  }

  @Selector()
  static searchTasks(state: SearchStateModel) {
    return state.searchTasks;
  }

  @Action(TaskActions.Search)
  Search(
    { patchState }: StateContext<SearchStateModel>,
    { payload }: TaskActions.Search
  ) {
    patchState({ query: payload, loading: true, });
  }

  @Action(TaskActions.SearchComplete)
  SearchComplete(
    { patchState }: StateContext<SearchStateModel>,
    { payload }: TaskActions.SearchComplete
  ) {
    patchState({ loading: false });
  }

  @Action(TaskActions.SearchError)
  SearchError(
    { patchState }: StateContext<SearchStateModel>,
    { payload }: TaskActions.SearchError
  ) {
    patchState({ loading: false });
  }

}
