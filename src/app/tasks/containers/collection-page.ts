import { CollectionState } from '../store';
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs/Observable';
import { Task } from '../models/task';


@Component({
  selector: 'bc-collection-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-card>
      <mat-card-title>My Pomodo-it Tasks</mat-card-title>
    </mat-card>

    <bc-task-preview-list [tasks]="tasks$ | async"></bc-task-preview-list>
  `,
  styles: [
    `
    mat-card-title {
      display: flex;
      justify-content: center;
    }
  `,
  ],
})
export class CollectionPageComponent implements OnInit {

  @Select((state: any) => state.taskState.tasks) tasks$: Observable<Task[]>;

  constructor(private store: Store) {}

  ngOnInit() {}
}
