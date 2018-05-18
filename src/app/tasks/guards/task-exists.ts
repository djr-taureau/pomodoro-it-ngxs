import { TodoistTasksService } from './../../services/todoist-tasks';
import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { Store, Select } from '@ngxs/store';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { map, switchMap, filter, take, tap, catchError } from 'rxjs/operators';
import { Task } from '../models/task';
import { LoadTask, SelectTask, AddTask, Load } from '../store';
import { AppState, TaskState, SearchState, CollectionState } from './../store/index';




@Injectable(
  {
    providedIn: 'root',
  }
)
export class TaskExistsGuard implements CanActivate {

  @Select(TaskState) taskState$: Observable<any>;
  @Select(SearchState) searchState$: Observable<any>;
  @Select(TaskState.Tasks) tasks$: Observable<Task[]>;
  @Select(CollectionState.Loaded) loaded$: Observable<boolean>;

  constructor(private store: Store, private todoist: TodoistTasksService,
    public router: Router) {}


  waitForCollectionToLoad(): Observable<boolean> {
    return this.loaded$.pipe(
      filter(loaded => loaded),
      take(1)
    );
  }

  // hasTaskInStore(id: string): Observable<boolean> {
  //   return this.tasks$.pipe(
  //     map(tasks => !!tasks[id]),
  //     take(1)
  //   );
  // }

  hasTaskInStore(id: string): Observable<boolean> {
    this.store.selectSnapshot(TaskState.SelectedTaskId);
    return this.tasks$.pipe(
      map(tasks => !!tasks[id]),
      take(1)
    );
  }

  hasTask(id: string): Observable<boolean> {
    return this.store.select(state => state.TaskState.tasks).pipe(
      map((tasks: Task[]) => tasks.filter(task => task.id === id)),
      switchMap(task => {
        if (!!task) {
          return this.store
            .dispatch(new LoadTask(task))
            .pipe(switchMap(() => of(true)));
        }
        return of(false);
      })
    );
  }

  hasTaskInApi(id: string): Observable<boolean> {
    return this.todoist.retrieveTask(id).pipe(
      tap(task => this.store.select(new AddTask(task))),
      map(task => !!task),
      catchError(() => {
        this.router.navigate(['/404']);
        return of(false);
      })
    );
  }

  checkStore(): Observable<boolean> {
    return this.loaded$.pipe(
      switchMap((loaded: boolean) => {
        if (!loaded) {
          return this.store.dispatch(new Load());
        }
        return of(true);
      }),
      take(1)
    );
  }

  canActivate(route: ActivatedRouteSnapshot) {
    return this.checkStore().pipe(
      switchMap(() => {
        const id = route.params.id;
        return this.hasTask(id);
      })
    );
  }
}
