import { CollectionState } from '../store';
import * as collection from '../store/collection.actions';
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Observable } from 'rxjs/Observable';
import { map, withLatestFrom } from 'rxjs/operators';
import { Task } from '../models/task';


@Component({
  selector: 'bc-collection-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-card>
      <mat-card-title>My Pomodo-it Tasks</mat-card-title>
    </mat-card>

    <bc-task-preview-list [tasks]="tasks$ | async "></bc-task-preview-list>
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

  @Select((state: any) => state.collectionState.collection) tasks$: Observable<Task[]>;

  constructor(private store: Store) {
    this.store.dispatch(new collection.Load());
  }

  ngOnInit() {
    this.tasks$.pipe(map(tasks => tasks));
  }
}
