import { TaskPreviewListComponent } from './../components/task-preview-list';
import { Subscription } from 'rxjs/Subscription';
import { Component, ChangeDetectorRef, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { Store, Select, ofAction, Actions } from '@ngxs/store';
import { Navigate } from '@ngxs/router-plugin';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { take, catchError, map, debounceTime, filter, switchMap, skip, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { Task } from '../models/task';
import * as task from '../store/task.actions';
import { TaskState, SearchState, CollectionState } from '../store';
import { FormControlName } from '@angular/forms';
import { TodoistTasksService } from '../../services/todoist-tasks';
@Component({
  selector: 'bc-find-task-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <bc-task-search
      [query]="searchQuery$ | async"
      [searching]="loading$ | async"
      [error]="error$ | async"
      (search)="search($event)">
    </bc-task-search>
    <bc-task-preview-list [tasks]="tasks$ | async">
    </bc-task-preview-list>
  `,
})
export class FindTaskPageComponent implements OnInit, OnDestroy {

  state: any;
  storeSub: Subscription;
  taskStateSub: Subscription;
  searchStateSub: Subscription;

  @Select(TaskState) taskState$: Observable<any>;
  @Select(SearchState) searchState$: Observable<any>;
  @Select(CollectionState) collectionState$: Observable<any>;
  @Select(TaskState.Tasks) tasks$: Observable<Task[]>;
  @Select(SearchState.Loading) loading$: Observable<boolean>;
  @Select(SearchState.Error) error$: Observable<string>;
  @Select(SearchState.Query) searchQuery$: Observable<string>;

  constructor(private store: Store, private actions$: Actions,
              private todoist: TodoistTasksService) {
  }

  search(query: string) {
    this.store.dispatch(new task.Search(query));

  }

  ngOnInit() {
    // placeholder
  }

  ngOnDestroy() {
    // placeholder
  }
}

