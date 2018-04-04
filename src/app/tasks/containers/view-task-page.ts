import { Component, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { map } from 'rxjs/operators';

import * as fromTasks from '../reducers';
import * as task from '../actions/Task';

/**
 * Note: Container components are also reusable. Whether or not
 * a component is a presentation component or a container
 * component is an implementation detail.
 *
 * The View Task Page's responsibility is to map router params
 * to a 'Select' Task action. Actually showing the selected
 * Task remains a responsibility of the
 * SelectedTaskPageComponent
 */
@Component({
  selector: 'bc-view-task-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <bc-selected-task-page></bc-selected-task-page>
  `,
})
export class ViewTaskPageComponent implements OnDestroy {
  actionsSubscription: Subscription;

  constructor(store: Store<fromTasks.State>, route: ActivatedRoute) {
    this.actionsSubscription = route.params
      .pipe(map(params => new task.Select(params.id)))
      .subscribe(store);
  }

  ngOnDestroy() {
    this.actionsSubscription.unsubscribe();
  }
}
