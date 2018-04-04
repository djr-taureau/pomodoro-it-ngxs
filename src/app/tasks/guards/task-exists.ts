import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { filter, take, map, tap, catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

import { TodoistTasksService } from '../../core/services/todoist-tasks';
import * as fromTasks from '../reducers';
import * as task from '../actions/task';

/**
 * Guards are hooks into the route resolution process, providing an opportunity
 * to inform the router's navigation process whether the route should continue
 * to activate this route. Guards must return an observable of true or false.
 */
@Injectable()
export class TaskExistsGuard implements CanActivate {
  constructor(
    private store: Store<fromTasks.State>,
    private todoistTaskService: TodoistTasksService,
    private router: Router
  ) {}

  /**
   * This method creates an observable that waits for the `loaded` property
   * of the collection state to turn `true`, emitting one time once loading
   * has finished.
   */
  waitForCollectionToLoad(): Observable<boolean> {
    return this.store.pipe(
      select(fromTasks.getCollectionLoaded),
      filter(loaded => loaded),
      take(1)
    );
  }

  /**
   * This method checks if a Task with the given ID is already registered
   * in the Store
   */
  hasTaskInStore(id: string): Observable<boolean> {
    return this.store.pipe(
      select(fromTasks.getTaskEntities),
      map(entities => !!entities[id]),
      take(1)
    );
  }

  /**
   * This method loads a Task with the given ID from the API and caches
   * it in the store, returning `true` or `false` if it was found.
   */
  hasTaskInApi(id: string): Observable<boolean> {
    return this.todoistTaskService.retrieveTask(id).pipe(
      map(taskEntity => new task.Load(taskEntity)),
      tap((action: task.Load) => this.store.dispatch(action)),
      map(task => !!task),
      catchError(() => {
        this.router.navigate(['/404']);
        return of(false);
      })
    );
  }

  /**
   * `hasTask` composes `hasTaskInStore` and `hasTaskInApi`. It first checks
   * if the Task is in store, and if not it then checks if it is in the
   * API.
   */
  hasTask(id: string): Observable<boolean> {
    return this.hasTaskInStore(id).pipe(
      switchMap(inStore => {
        if (inStore) {
          return of(inStore);
        }
        console.log(this.hasTaskInApi);
        return this.hasTaskInApi(id);
      })
    );
  }

  /**
   * This is the actual method the router will call when our guard is run.
   *
   * Our guard waits for the collection to load, then it checks if we need
   * to request a Task from the API or if we already have it in our cache.
   * If it finds it in the cache or in the API, it returns an Observable
   * of `true` and the route is rendered successfully.
   *
   * If it was unable to find it in our cache or in the API, this guard
   * will return an Observable of `false`, causing the router to move
   * on to the next candidate route. In this case, it will move on
   * to the 404 page.
   */
  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.waitForCollectionToLoad().pipe(
      switchMap(() => this.hasTask(route.params['id']))
    );
  }
}
