import { PIPES } from './../../shared/pipes/index';
import { TodoistTasksService } from './../../services/todoist-tasks';
import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { Store, Select } from '@ngxs/store';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { map, switchMap, filter, take, tap, catchError, mapTo } from 'rxjs/operators';
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
  @Select(TaskState.SelectedTaskId) selectedTaskId$: Observable<any>;
  @Select(CollectionState.CollectionIds) ids$: Observable<any>;
  @Select(CollectionState.Loaded) loaded$: Observable<boolean>;

  constructor(private store: Store, private todoist: TodoistTasksService,
    public router: Router) {}


  waitForCollectionToLoad(): Observable<boolean> {
    return this.loaded$.pipe(
      filter(loaded => loaded),
      take(1)
    );
  }


  hasTaskInCollection(id: string): Observable<boolean> {
    // this.tasks$.subscribe(value => value);
    return this.ids$.pipe(
      map(tasks => !!tasks[id]),
      take(1)
    );
  }

  // isTaskInCollection(id: string): Observable<boolean> {
  //   const selectedTask = this.store.selectSnapshot(TaskState.SelectedTaskId);
  //   const collectionIds = this.store.selectSnapshot(CollectionState.CollectionIds);
  //   return collectionIds.indexOf(id) > -1;
  // }

  hasTaskInApi(id: string): Observable<boolean> {
    return this.todoist.retrieveTask(id).pipe(
      // TODO is it LOAD or SELECT
      tap(task => this.store.dispatch(new LoadTask(task))),
      // tap(task => console.log('me task in api', task)),
      map(task => !!task),
      catchError(error => {
        console.log(error);
        this.router.navigate(['/404']);
        return of(false);
      })
    );
  }

  hasTask(id: string): Observable<boolean> {
    return this.hasTaskInCollection(id).pipe(
      switchMap(inStore => {
        if (inStore) {
          return of(inStore);
        }
        return this.hasTaskInApi(id);
      }),
    );
  }
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
    return this.waitForCollectionToLoad().pipe(
       switchMap(() => {
        return this.hasTask(route.params['id']);
       })
     );
  }
}
