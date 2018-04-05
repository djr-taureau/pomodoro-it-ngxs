import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MatCardModule } from '@angular/material';

import { ViewTaskPageComponent } from './view-task-page';
import * as TaskActions from '../actions/task';
import * as fromTasks from '../reducers';
import { SelectedTaskPageComponent } from './selected-task-page';
import { TaskDetailComponent } from '../components/task-detail';
import { AddCommasPipe } from '../../shared/pipes/add-commas';

describe('View Task Page', () => {
  let params = new BehaviorSubject({});
  let fixture: ComponentFixture<ViewTaskPageComponent>;
  let store: Store<fromTasks.State>;
  let instance: ViewTaskPageComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatCardModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { params },
        },
        {
          provide: Store,
          useValue: {
            select: jest.fn(),
            next: jest.fn(),
            pipe: jest.fn(),
          },
        },
      ],
      declarations: [
        ViewTaskPageComponent,
        SelectedTaskPageComponent,
        TaskDetailComponent,
        TaskAuthorsComponent,
        AddCommasPipe,
      ],
    });

    fixture = TestBed.createComponent(ViewTaskPageComponent);
    instance = fixture.componentInstance;
    store = TestBed.get(Store);
  });

  it('should compile', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch a Task.Select action on init', () => {
    const action = new TaskActions.Select('2');
    params.next({ id: '2' });

    fixture.detectChanges();

    expect(store.next).toHaveBeenLastCalledWith(action);
  });
});
