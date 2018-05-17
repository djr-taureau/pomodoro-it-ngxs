import { TodoistTasksService } from './../../services/todoist-tasks';
import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { Store } from '@ngxs/store';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { map, switchMap, take, tap, catchError } from 'rxjs/operators';
import { Task } from '../models/task';
import { LoadTask, SelectTask, AddTask, Load } from '../store';
import { AppState } from './../store/index';




@Injectable(
  {
    providedIn: 'root',
  }
)
export class TaskExistsGuard implements CanActivate {

  constructor(private store: Store, private todoist: TodoistTasksService,
    public router: Router) {}
  canActivate(route: ActivatedRouteSnapshot) {
    return this.checkStore().pipe(
      switchMap(() => {
        const id = route.params.id;
        console.log('is this id defined', id);
        return this.hasTask(id);
      })
    );
  }

  hasTask(id: number): Observable<boolean> {
    return this.store.select(state => state.TaskState.tasks).pipe(
      map((tasks: Task[]) => tasks.find(task => task.id === id)),
      switchMap(task => {
        if (!!task) {
          return this.store
            .dispatch(new SelectTask(task.id))
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
    return this.store.select(state => state.taskState.loaded).pipe(
      switchMap((loaded: boolean) => {
        if (!loaded) {
          return this.store.dispatch(new Load());
        }
        return of(true);
      }),
      take(1)
    );
  }
}
