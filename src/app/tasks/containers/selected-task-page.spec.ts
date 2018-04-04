import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectedTaskPageComponent } from './selected-Task-page';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material';

import * as CollectionActions from '../actions/collection';
import * as fromTasks from '../reducers';
import { TaskDetailComponent } from '../components/Task-detail';
import { Task, generateMockTask } from '../models/Task';
import { TaskAuthorsComponent } from '../components/Task-authors';
import { AddCommasPipe } from '../../shared/pipes/add-commas';

describe('Selected Task Page', () => {
  let fixture: ComponentFixture<SelectedTaskPageComponent>;
  let store: Store<fromTasks.State>;
  let instance: SelectedTaskPageComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        StoreModule.forRoot({
          Tasks: combineReducers(fromTasks.reducers),
        }),
        MatCardModule,
      ],
      declarations: [
        SelectedTaskPageComponent,
        TaskDetailComponent,
        TaskAuthorsComponent,
        AddCommasPipe,
      ],
    });

    fixture = TestBed.createComponent(SelectedTaskPageComponent);
    instance = fixture.componentInstance;
    store = TestBed.get(Store);

    spyOn(store, 'dispatch').and.callThrough();
  });

  it('should compile', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch a collection.AddTask action when addToCollection is called', () => {
    const $event: Task = generateMockTask();
    const action = new CollectionActions.AddTask($event);

    instance.addToCollection($event);

    expect(store.dispatch).toHaveBeenLastCalledWith(action);
  });

  it('should dispatch a collection.RemoveTask action on removeFromCollection', () => {
    const $event: Task = generateMockTask();
    const action = new CollectionActions.RemoveTask($event);

    instance.removeFromCollection($event);

    expect(store.dispatch).toHaveBeenLastCalledWith(action);
  });
});
