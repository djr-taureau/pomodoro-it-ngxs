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
    <bc-task-preview-list [tasks]="this.tasks">
    </bc-task-preview-list>
  `,
})
export class FindTaskPageComponent implements OnInit, OnDestroy {

  //private destroy$: Subject<void> = New Subject<void>();

  // public searchCtrl: FormControlName = new FormControlName();
  subscription: Subscription;
  tasks = [];
  state: any;
  storeSub: Subscription;
  @Select((state: any) => state.TasksState.tasks)
  @Select(state => state.query) searchQuery$: Observable<String>;
  @Select(state => state.tasks) tasks$: Observable<Task[]>;
  @Select(state => state.loading) loading$: Observable<boolean>;
  @Select(state => state.error) error$: Observable<string>;


  constructor(private store: Store, private actions$: Actions,
              private todoist: TodoistTasksService,
              private chr: ChangeDetectorRef) {
    // this.store.dispatch(new task.Search('angular'));
  }
    // this.searchQuery$ = store.dispatch(new task.Search), take(1));
    // this.tasks$ = store.pipe(select(fromTasks.getSearchResults));
    // this.loading$ = store.pipe(select(fromTasks.getSearchLoading));
    // this.error$ = store.pipe(select(fromTasks.getSearchError));///


  search(query: string) {
    this.store.dispatch(new task.Search(query));
    // this.searchQuery$.pipe(
    //   debounceTime(300),
    //   filter(value => typeof value === 'string' && value.trim() !== ''),
    //   switchMap(value => this.store.dispatch(new task.Search(value.toString())))
    // )
    // .subscribe(_ => true);
    // const nextSearch$ = this.actions$.pipe(
    //   ofAction(task.Search),
    //   skip(1)
    // );
    // return this.todoist
    // .searchTasks(query)
    // .pipe(
    //   takeUntil(nextSearch$),
    //   map((tasks: Task[]) => new task.SearchComplete(tasks)),
    //   catchError(err => of(new task.SearchError(err)))
    // );
  }

  // getTasks(): Observable<Task[]> {
  //   return this.tasks$.map(
  //     (task => {
  //       return task.data;
  //     })
  //   )
  // };

  ngOnInit() {

    // this.searchQuery$ = this.store.select(TaskState.query).pipe(
    //   tap((value) => {
    //     console.log('query', value);
    //   })3
    // );
    this.searchQuery$ = null;
    this.store.subscribe((state: any) => {
      this.state = {...state};
      this.chr.detectChanges();
    });
    this.tasks$.subscribe(tasks => {
      this.tasks.push(tasks);
    });
    this.loading$.subscribe(value => console.log('loading', value));
    this.error$.subscribe(value => console.log('error', value));
  }

  ngOnDestroy() {
    //
  }
}

