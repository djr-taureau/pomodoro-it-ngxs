import { Observable } from 'rxjs/Observable';
import { Navigate } from '@ngxs/router-plugin';
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Params, NavigationCancel, NavigationError,
  Router, RouterStateSnapshot, RoutesRecognized, ActivatedRouteSnapshot } from '@angular/router';
import { Store, Select, getActionTypeFromInstance, Actions, ofActionDispatched } from '@ngxs/store';
import { Subscription } from 'rxjs/Subscription';
import { map } from 'rxjs/operators';
import { SelectTask, LoadTask } from '../store/task.actions';
import * as task from '../store/tasks.state';
import { TaskState, CollectionState } from '../store/';
import * as pomo from '../store/pomos.state';

@Component({
  selector: 'bc-view-task-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <bc-selected-task-page></bc-selected-task-page>
  `,
})

export class ViewTaskPageComponent implements OnDestroy {
  actionsSubscription: Subscription;


  constructor(private store: Store, private router: Router,
              private actions$: Actions, private route: ActivatedRoute) {
    this.actions$
        .pipe(ofActionDispatched(LoadTask))
        .subscribe(({ payload }) => console.log(payload));
    this.actionsSubscription = route.params
    .pipe(map(params => this.store.dispatch(new LoadTask(params.id)))).subscribe();
  }

  ngOnDestroy() {
    this.actionsSubscription.unsubscribe();
  }

}
