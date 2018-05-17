
import { TaskState } from './tasks.state';
import { PomoState } from './pomos.state';
import { SearchState } from './search.state';
import { CollectionState } from './collection.state';

import * as taskActions from './task.actions';
import * as pomoActions from './pomo.actions';
import * as collectionActions from './collection.actions';

export const AppState = [CollectionState, SearchState, TaskState, PomoState];

export * from './tasks.state';
export * from './search.state';
export * from './pomos.state';
export * from './collection.state';

export * from './task.actions';
export * from './collection.actions';
