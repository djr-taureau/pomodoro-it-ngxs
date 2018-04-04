import { Actions } from '@ngrx/effects';
import { TestBed } from '@angular/core/testing';
import { empty } from 'rxjs/observable/empty';
import { cold, hot } from 'jasmine-marbles';
import { CollectionEffects } from './collection';
import { Database } from '@ngrx/db';
import { Task } from '../models/Task';
import * as CollectionActions from '../actions/collection';
import { Observable } from 'rxjs/Observable';

export class TestActions extends Actions {
  constructor() {
    super(empty());
  }

  set stream(source: Observable<any>) {
    this.source = source;
  }
}

export function getActions() {
  return new TestActions();
}

describe('CollectionEffects', () => {
  let db: any;
  let effects: CollectionEffects;
  let actions$: TestActions;

  const Task1 = { id: '111', volumeInfo: {} } as Task;
  const Task2 = { id: '222', volumeInfo: {} } as Task;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CollectionEffects,
        {
          provide: Database,
          useValue: {
            open: jest.fn(),
            query: jest.fn(),
            insert: jest.fn(),
            executeWrite: jest.fn(),
          },
        },
        { provide: Actions, useFactory: getActions },
      ],
    });

    db = TestBed.get(Database);
    effects = TestBed.get(CollectionEffects);
    actions$ = TestBed.get(Actions);
  });

  describe('openDB$', () => {
    it('should call db.open when initially subscribed to', () => {
      effects.openDB$.subscribe();
      expect(db.open).toHaveBeenCalledWith('Tasks_app');
    });
  });

  describe('loadCollection$', () => {
    it('should return a collection.LoadSuccess, with the Tasks, on success', () => {
      const action = new CollectionActions.Load();
      const completion = new CollectionActions.LoadSuccess([Task1, Task2]);

      actions$.stream = hot('-a', { a: action });
      const response = cold('-a-b|', { a: Task1, b: Task2 });
      const expected = cold('-----c', { c: completion });
      db.query = jest.fn(() => response);

      expect(effects.loadCollection$).toBeObservable(expected);
    });

    it('should return a collection.LoadFail, if the query throws', () => {
      const action = new CollectionActions.Load();
      const error = 'Error!';
      const completion = new CollectionActions.LoadFail(error);

      actions$.stream = hot('-a', { a: action });
      const response = cold('-#', {}, error);
      const expected = cold('--c', { c: completion });
      db.query = jest.fn(() => response);

      expect(effects.loadCollection$).toBeObservable(expected);
    });
  });

  describe('addTaskToCollection$', () => {
    it('should return a collection.AddTaskSuccess, with the Task, on success', () => {
      const action = new CollectionActions.AddTask(Task1);
      const completion = new CollectionActions.AddTaskSuccess(Task1);

      actions$.stream = hot('-a', { a: action });
      const response = cold('-b', { b: true });
      const expected = cold('--c', { c: completion });
      db.insert = jest.fn(() => response);

      expect(effects.addTaskToCollection$).toBeObservable(expected);
      expect(db.insert).toHaveBeenCalledWith('Tasks', [Task1]);
    });

    it('should return a collection.AddTaskFail, with the Task, when the db insert throws', () => {
      const action = new CollectionActions.AddTask(Task1);
      const completion = new CollectionActions.AddTaskFail(Task1);
      const error = 'Error!';

      actions$.stream = hot('-a', { a: action });
      const response = cold('-#', {}, error);
      const expected = cold('--c', { c: completion });
      db.insert = jest.fn(() => response);

      expect(effects.addTaskToCollection$).toBeObservable(expected);
    });

    describe('removeTaskFromCollection$', () => {
      it('should return a collection.RemoveTaskSuccess, with the Task, on success', () => {
        const action = new CollectionActions.RemoveTask(Task1);
        const completion = new CollectionActions.RemoveTaskSuccess(Task1);

        actions$.stream = hot('-a', { a: action });
        const response = cold('-b', { b: true });
        const expected = cold('--c', { c: completion });
        db.executeWrite = jest.fn(() => response);

        expect(effects.removeTaskFromCollection$).toBeObservable(expected);
        expect(db.executeWrite).toHaveBeenCalledWith('Tasks', 'delete', [
          Task1.id,
        ]);
      });

      it('should return a collection.RemoveTaskFail, with the Task, when the db insert throws', () => {
        const action = new CollectionActions.RemoveTask(Task1);
        const completion = new CollectionActions.RemoveTaskFail(Task1);
        const error = 'Error!';

        actions$.stream = hot('-a', { a: action });
        const response = cold('-#', {}, error);
        const expected = cold('--c', { c: completion });
        db.executeWrite = jest.fn(() => response);

        expect(effects.removeTaskFromCollection$).toBeObservable(expected);
        expect(db.executeWrite).toHaveBeenCalledWith('Tasks', 'delete', [
          Task1.id,
        ]);
      });
    });
  });
});
