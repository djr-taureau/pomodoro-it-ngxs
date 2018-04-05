import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatCardModule,
  MatInputModule,
  MatProgressSpinnerModule,
} from '@angular/material';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { TaskSearchComponent } from '../components/task-search';
import { TaskPreviewComponent } from '../components/task-preview';
import { TaskPreviewListComponent } from '../components/task-preview-list';
import { RouterTestingModule } from '@angular/router/testing';
import { EllipsisPipe } from '../../shared/pipes/ellipsis';
import { AddCommasPipe } from '../../shared/pipes/add-commas';
import { FindTaskPageComponent } from './find-task-page';
import * as TaskActions from '../actions/task';
import * as fromTasks from '../reducers';

describe('Find Task Page', () => {
  let fixture: ComponentFixture<FindTaskPageComponent>;
  let store: Store<fromTasks.State>;
  let instance: FindTaskPageComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        StoreModule.forRoot({
          Tasks: combineReducers(fromTasks.reducers),
        }),
        RouterTestingModule,
        MatInputModule,
        MatCardModule,
        MatProgressSpinnerModule,
        ReactiveFormsModule,
      ],
      declarations: [
        FindTaskPageComponent,
        TaskSearchComponent,
        TaskPreviewComponent,
        TaskPreviewListComponent,
        AddCommasPipe,
        EllipsisPipe,
      ],
    });

    fixture = TestBed.createComponent(FindTaskPageComponent);
    instance = fixture.componentInstance;
    store = TestBed.get(Store);

    spyOn(store, 'dispatch').and.callThrough();
  });

  it('should compile', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch a Task.Search action on search', () => {
    const $event: string = 'Task name';
    const action = new TaskActions.Search($event);

    instance.search($event);

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });
});
