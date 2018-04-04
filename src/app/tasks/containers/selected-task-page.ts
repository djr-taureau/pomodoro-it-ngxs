import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';

import * as fromTasks from '../reducers';
import * as collection from '../actions/collection';
import { Task } from '../models/Task';

@Component({
  selector: 'bc-selected-task-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <bc-task-detail
      [task]="task$ | async"
      [inCollection]="isSelectedTaskInCollection$ | async"
      (add)="addToCollection($event)"
      (remove)="removeFromCollection($event)">
    </bc-task-detail>
  `,
})
export class SelectedTaskPageComponent {
  task$: Observable<Task>;
  isSelectedTaskInCollection$: Observable<boolean>;

  constructor(private store: Store<fromTasks.State>) {
    this.task$ = store.pipe(select(fromTasks.getSelectedTask));
    this.isSelectedTaskInCollection$ = store.pipe(
      select(fromTasks.isSelectedTaskInCollection)
    );
  }

  addToCollection(task: Task) {
    this.store.dispatch(new collection.AddTask(task));
  }

  removeFromCollection(task: Task) {
    this.store.dispatch(new collection.RemoveTask(task));
  }
}
