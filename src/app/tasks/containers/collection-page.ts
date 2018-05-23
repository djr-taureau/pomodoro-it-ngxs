import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs/Observable';
import { map, withLatestFrom } from 'rxjs/operators';
import { Task } from '../models/task';
import { CollectionState } from '../store/collection.state';
import { AddTask, RemoveTask, Load } from '../store/collection.actions';

@Component({
  selector: 'bc-collection-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-card>
      <mat-card-title>My Pomodo-it Tasks</mat-card-title>
    </mat-card>

    <bc-task-preview-list [tasks]="collection$ | async "></bc-task-preview-list>
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

  @Select(CollectionState) collection$: Observable<Task[]>;

  constructor(private store: Store) {
  }

  ngOnInit() {
    // placeholder
  }
}
