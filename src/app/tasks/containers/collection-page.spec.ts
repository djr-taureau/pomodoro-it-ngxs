import { CollectionPageComponent } from './collection-page';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MatCardModule, MatInputModule } from '@angular/material';
import { TaskPreviewListComponent } from '../components/Task-preview-list';
import { TaskPreviewComponent } from '../components/Task-preview';
import * as CollectionActions from '../actions/collection';
import * as fromTasks from '../reducers';
import { EllipsisPipe } from '../../shared/pipes/ellipsis';
import { AddCommasPipe } from '../../shared/pipes/add-commas';

describe('Collection Page', () => {
  let fixture: ComponentFixture<CollectionPageComponent>;
  let store: Store<fromTasks.State>;
  let instance: CollectionPageComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        StoreModule.forRoot({
          Tasks: combineReducers(fromTasks.reducers),
        }),
        MatCardModule,
        MatInputModule,
        RouterTestingModule,
      ],
      declarations: [
        CollectionPageComponent,
        TaskPreviewListComponent,
        TaskPreviewComponent,
        TaskAuthorsComponent,
        AddCommasPipe,
        EllipsisPipe,
      ],
    });

    fixture = TestBed.createComponent(CollectionPageComponent);
    instance = fixture.componentInstance;
    store = TestBed.get(Store);

    spyOn(store, 'dispatch').and.callThrough();
  });

  it('should compile', () => {
    fixture.detectChanges();

    expect(fixture).toMatchSnapshot();
  });

  it('should dispatch a collection.Load on init', () => {
    const action = new CollectionActions.Load();

    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(action);
  });
});
