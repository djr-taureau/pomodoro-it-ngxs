import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Params, NavigationCancel, NavigationError, Router, RouterStateSnapshot, RoutesRecognized } from '@angular/router';
import { Store, Select, getActionTypeFromInstance } from '@ngxs/store';
import { Subscription } from 'rxjs/Subscription';
import { map } from 'rxjs/operators';
import { SelectTask } from '../store/task.actions';
import * as task from '../store/tasks.state';
import { TaskState } from '../store/tasks.state';
import * as pomo from '../store/pomos.state';



@Component({
  selector: 'bc-view-task-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <bc-selected-task-page></bc-selected-task-page>
  `,
})
export class ViewTaskPageComponent {
  @Select(SelectTask)
  actionsSubscription: Subscription;
  constructor(private store: Store, private route: ActivatedRoute) {
    route.params
    .pipe(map(params => params.id = this.store.dispatch(SelectTask)));
  }
}
