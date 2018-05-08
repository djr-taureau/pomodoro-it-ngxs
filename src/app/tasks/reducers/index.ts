

import {
  createSelector,
  createFeatureSelector,
  ActionReducerMap,
} from '@ngrx/store';
import * as fromSearch from './search';
import * as fromTasks from './tasks';
import * as fromCollection from './collection';
import * as fromRoot from '../../reducers';
import * as fromPomos from './pomos';
import { createEntityAdapter } from '@ngrx/entity';
import { getSelectedId } from './tasks';
import { StoreRouterConnectingModule, RouterStateSerializer, routerReducer } from '@ngrx/router-store';
import { Params } from '@angular/router';
import { Pomo } from '../models/pomo';
import { Task } from '../models/task';
export interface TasksState {
  search: fromSearch.State;
  tasks: fromTasks.State;
  pomos: fromPomos.State;
  collection: fromCollection.State;
}

export interface State extends fromRoot.State {
  tasks: TasksState;
}

export const reducers: ActionReducerMap<TasksState> = {
  search: fromSearch.reducer,
  tasks: fromTasks.reducer,
  pomos: fromPomos.reducer,
  collection: fromCollection.reducer,
};

/**
 * A selector function is a map function factory. We pass it parameters and it
 * returns a function that maps from the larger state tree into a smaller
 * piece of state. This selector simply selects the `Tasks` state.
 *
 * Selectors are used with the `select` operator.
 *
 * ```ts
 * class MyComponent {
 *   constructor(state$: Observable<State>) {
 *     this.TasksState$ = state$.pipe(select(getTasksState));
 *   }
 * }
 * ```
 */

/**
 * The createFeatureSelector function selects a piece of state from the root of the state object.
 * This is used for selecting feature states that are loaded eagerly or lazily.
 */
export const getTasksState = createFeatureSelector<TasksState>('tasks');
// export const getPomosState = createFeatureSelector<TasksState>('pomos');
/**
 * Every reducer module exports selector functions, however child reducers
 * have no knowledge of the overall state tree. To make them usable, we
 * need to make new selectors that wrap them.
 *
 * The createSelector function creates very efficient selectors that are memoized and
 * only recompute when arguments change. The created selectors can also be composed
 * together to select different pieces of state.
 */
export const getTaskEntitiesState = createSelector(
  getTasksState,
  state => state.tasks
);

export const {
  selectIds: getTaskIds,
  selectEntities: getTaskEntities,
  selectAll: getAllTasks,
  selectTotal: getTotalTasks,
} = fromTasks.adapter.getSelectors(getTaskEntitiesState);

export const getPomosEntitiesState = createSelector(
  getTasksState,
  state => state.pomos
);

export const {
  selectIds: getPomoIds,
  selectEntities: getPomoEntities,
  selectAll: getAllPomos,
  selectTotal: getTotalPomos,
} = fromPomos.adapter.getSelectors(getPomosEntitiesState);


export const getSelectedTaskId = createSelector(
  getTaskEntitiesState,
  fromTasks.getSelectedId
);

export const getSelectedTask = createSelector(
  getTaskEntities,
  getSelectedTaskId,
  (entities, selectedId) => {
    return selectedId && entities[selectedId];
  }
);


/**
 * Adapters created with @ngrx/entity generate
 * commonly used selector functions including
 * getting all ids in the record set, a dictionary
 * of the records by id, an array of records and
 * the total number of records. This reduces boilerplate
 * in selecting records from the entity state.
 */


/**
 * Just like with the Tasks selectors, we also have to compose the search
 * reducer's and collection reducer's selectors.
 */
export const getSearchState = createSelector(
  getTasksState,
  (state: TasksState) => state.search
);

export const getSearchTaskIds = createSelector(
  getSearchState,
  fromSearch.getIds
);
export const getSearchQuery = createSelector(
  getSearchState,
  fromSearch.getQuery
);
export const getSearchLoading = createSelector(
  getSearchState,
  fromSearch.getLoading
);
export const getSearchError = createSelector(
  getSearchState,
  fromSearch.getError
);

/**
 * Some selector functions create joins across parts of state. This selector
 * composes the search result IDs to return an array of Tasks in the store.
 */
export const getSearchResults = createSelector(
  getTaskEntities,
  getSearchTaskIds,
  (tasks, searchIds) => {
    return searchIds.map(id => tasks[id]);
  }
);

export const getCollectionState = createSelector(
  getTasksState,
  (state: TasksState) => state.collection
);

// export const getPomosState = createSelector(
//   getTasksState,
//   (state: TasksState) => state.pomos
// );

export const getCollectionLoaded = createSelector(
  getCollectionState,
  fromCollection.getLoaded
);

export const getCollectionLoading = createSelector(
  getCollectionState,
  fromCollection.getLoading
);
export const getCollectionTaskIds = createSelector(
  getCollectionState,
  fromCollection.getIds
);


export const getTaskCollection = createSelector(
  getTaskEntities,
  getCollectionTaskIds,
  (entities, ids) => {
    return ids.map(id => entities[id]);
  }
);

export interface State {
  selectedTask: Task;
  allPomos: Pomo[];
}


// export const selectAllPomos = (state: State) => state.allPomos;

// export const getPomosTask = createSelector(
//   getSelectedTaskId,
//   selectAllPomos,
//   (id, allPomos: Pomo[]) => {
//     if (id && selectAllPomos) {
//       return allPomos.filter((pomo: Pomo) => pomo.task_id === id);
//     } else {
//       return allPomos;
//     }
//   }
// );

// export const getAllPomos = Pomo[] => {
//   return createSelector(
//     getPomosTask(selectedTask),

//   )
// }

export const isSelectedTaskInCollection = createSelector(
  getCollectionTaskIds,
  getSelectedTaskId,
  (ids, selected) => {
    ids = ids.map(id => id.toString());
    ids.map(id => id.toString());
    console.log(typeof(ids[0]));
    console.log(typeof(selected));
    console.log([ids]);
    console.log(ids.indexOf(selected));
    return ids.indexOf(selected) > -1;
  }
);


