import { reducer } from './Tasks';
import * as fromTasks from './Tasks';
import { SearchComplete, Load, Select } from '../actions/Task';
import { Task, generateMockTask } from '../models/Task';
import { LoadSuccess } from '../actions/collection';

describe('TasksReducer', () => {
  const Task1 = generateMockTask();
  const Task2 = { ...Task1, id: '222' };
  const Task3 = { ...Task1, id: '333' };
  const initialState: fromTasks.State = {
    ids: [Task1.id, Task2.id],
    entities: {
      [Task1.id]: Task1,
      [Task2.id]: Task2,
    },
    selectedTaskId: null,
  };

  describe('undefined action', () => {
    it('should return the default state', () => {
      const result = reducer(undefined, {} as any);

      expect(result).toMatchSnapshot();
    });
  });

  describe('SEARCH_COMPLETE & LOAD_SUCCESS', () => {
    function noExistingTasks(
      action: any,
      TasksInitialState: any,
      initialState: any,
      Tasks: Task[]
    ) {
      const createAction = new action(Tasks);

      const result = reducer(TasksInitialState, createAction);

      expect(result).toMatchSnapshot();
    }

    function existingTasks(action: any, initialState: any, Tasks: Task[]) {
      // should not replace existing Tasks
      const differentTask2 = { ...Tasks[0], foo: 'bar' };
      const createAction = new action([Tasks[1], differentTask2]);

      const expectedResult = {
        ids: [...initialState.ids, Tasks[1].id],
        entities: {
          ...initialState.entities,
          [Tasks[1].id]: Tasks[1],
        },
        selectedTaskId: null,
      };

      const result = reducer(initialState, createAction);

      expect(result).toMatchSnapshot();
    }

    it('should add all Tasks in the payload when none exist', () => {
      noExistingTasks(SearchComplete, fromTasks.initialState, initialState, [
        Task1,
        Task2,
      ]);

      noExistingTasks(LoadSuccess, fromTasks.initialState, initialState, [
        Task1,
        Task2,
      ]);
    });

    it('should add only new Tasks when Tasks already exist', () => {
      existingTasks(SearchComplete, initialState, [Task2, Task3]);

      existingTasks(LoadSuccess, initialState, [Task2, Task3]);
    });
  });

  describe('LOAD', () => {
    const expectedResult = {
      ids: [Task1.id],
      entities: {
        [Task1.id]: Task1,
      },
      selectedTaskId: null,
    };

    it('should add a single Task, if the Task does not exist', () => {
      const action = new Load(Task1);

      const result = reducer(fromTasks.initialState, action);

      expect(result).toMatchSnapshot();
    });

    it('should return the existing state if the Task exists', () => {
      const action = new Load(Task1);

      const result = reducer(expectedResult, action);

      expect(result).toMatchSnapshot();
    });
  });

  describe('SELECT', () => {
    it('should set the selected Task id on the state', () => {
      const action = new Select(Task1.id);

      const result = reducer(initialState, action);

      expect(result).toMatchSnapshot();
    });
  });

  describe('Selectors', () => {
    describe('getSelectedId', () => {
      it('should return the selected id', () => {
        const result = fromTasks.getSelectedId({
          ...initialState,
          selectedTaskId: Task1.id,
        });

        expect(result).toMatchSnapshot();
      });
    });
  });
});
