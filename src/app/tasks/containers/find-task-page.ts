import { TaskPreviewListComponent } from './../components/task-preview-list';
import { Subscription } from 'rxjs/Subscription';
import { Component, ChangeDetectorRef, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { Store, Select, ofAction, Actions } from '@ngxs/store';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { take, catchError, map, debounceTime, filter, switchMap, skip, takeUntil, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { Task } from '../models/task';
import * as task from '../store/task.actions';
import { TaskState } from '../store';
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
    <bc-task-preview-list [tasks]="tasks$ | async | json">
    </bc-task-preview-list>
  `,
})
export class FindTaskPageComponent implements OnInit, OnDestroy {

  state: any;
  storeSub: Subscription;
  // @Select((state: any) => state.TasksState.tasks)
  @Select(state => state.query) searchQuery$: Observable<String>;
  @Select(state => state.tasks) tasks$: Observable<Task[]>;
  @Select(state => state.loading) loading$: Observable<boolean>;
  @Select(state => state.error) error$: Observable<string>;


  constructor(private store: Store, private actions$: Actions,
              private todoist: TodoistTasksService,
              private chr: ChangeDetectorRef) {
  }


  search(query: string) {
    this.store.dispatch(new task.Search(query));

  }


  ngOnInit() {

    this.store.subscribe((state: any) => {
      this.state = {...state};
      this.chr.detectChanges();
    });

  }

  ngOnDestroy() {
    //
  }
}

