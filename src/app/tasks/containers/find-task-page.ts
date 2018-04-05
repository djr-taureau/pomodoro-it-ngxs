import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { take } from 'rxjs/operators';

import * as fromTasks from '../reducers';
import * as TaskActions from '../actions/task';
import { Task } from '../models/task';

@Component({
  selector: 'bc-find-task-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <bc-task-search [query]="searchQuery$ | async"
      [searching]="loading$ | async" [error]="error$ | async"
      (search)="search($event)">
    </bc-task-search>
    <bc-task-preview-list [tasks]="tasks$ | async">
    </bc-task-preview-list>
  `,
})
export class FindTaskPageComponent {
  searchQuery$: Observable<string>;
  tasks$: Observable<Task[]>;
  loading$: Observable<boolean>;
  error$: Observable<string>;

  constructor(private store: Store<fromTasks.State>) {
    this.searchQuery$ = store.pipe(select(fromTasks.getSearchQuery), take(1));
    this.tasks$ = store.pipe(select(fromTasks.getSearchResults));
    this.loading$ = store.pipe(select(fromTasks.getSearchLoading));
    this.error$ = store.pipe(select(fromTasks.getSearchError));
  }

  search(query: string) {
    this.store.dispatch(new TaskActions.Search(query));
  }
}
