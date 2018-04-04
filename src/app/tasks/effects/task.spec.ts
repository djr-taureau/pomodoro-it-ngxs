import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { cold, hot, getTestScheduler } from 'jasmine-marbles';
import { empty } from 'rxjs/observable/empty';
import { TaskEffects, SEARCH_SCHEDULER, SEARCH_DEBOUNCE } from './Task';
import { TodoistTasksService } from '../../core/services/google-Tasks';
import { Observable } from 'rxjs/Observable';
import { Search, SearchComplete, SearchError } from '../actions/Task';
import { Task } from '../models/Task';

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

describe('TaskEffects', () => {
  let effects: TaskEffects;
  let TodoistTasksService: any;
  let actions$: TestActions;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TaskEffects,
        {
          provide: TodoistTasksService,
          useValue: { searchTasks: jest.fn() },
        },
        { provide: Actions, useFactory: getActions },
        { provide: SEARCH_SCHEDULER, useFactory: getTestScheduler },
        { provide: SEARCH_DEBOUNCE, useValue: 30 },
      ],
    });

    effects = TestBed.get(TaskEffects);
    TodoistTasksService = TestBed.get(TodoistTasksService);
    actions$ = TestBed.get(Actions);
  });

  describe('search$', () => {
    it('should return a new Task.SearchComplete, with the Tasks, on success, after the de-bounce', () => {
      const Task1 = { id: '111', volumeInfo: {} } as Task;
      const Task2 = { id: '222', volumeInfo: {} } as Task;
      const Tasks = [Task1, Task2];
      const action = new Search('query');
      const completion = new SearchComplete(Tasks);

      actions$.stream = hot('-a---', { a: action });
      const response = cold('-a|', { a: Tasks });
      const expected = cold('-----b', { b: completion });
      TodoistTasksService.searchTasks = jest.fn(() => response);

      expect(effects.search$).toBeObservable(expected);
    });

    it('should return a new Task.SearchError if the Tasks service throws', () => {
      const action = new Search('query');
      const completion = new SearchError('Unexpected Error. Try again later.');
      const error = 'Unexpected Error. Try again later.';

      actions$.stream = hot('-a---', { a: action });
      const response = cold('-#|', {}, error);
      const expected = cold('-----b', { b: completion });
      TodoistTasksService.searchTasks = jest.fn(() => response);

      expect(effects.search$).toBeObservable(expected);
    });

    it(`should not do anything if the query is an empty string`, () => {
      const action = new Search('');

      actions$.stream = hot('-a---', { a: action });
      const expected = cold('---');

      expect(effects.search$).toBeObservable(expected);
    });
  });
});
