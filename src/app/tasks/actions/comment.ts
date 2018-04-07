import { Action } from '@ngrx/store';
import { Task } from '../models/task';

export enum TaskActionTypes {
  Search = '[Task] Search',
  SearchComplete = '[Task] Search Complete',
  SearchError = '[Task] Search Error',
  Load = '[Task] Load',
  Select = '[Task] Select',
}

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handTask/advanced-types.html#discriminated-unions
 */
export class Search implements Action {
  readonly type = TaskActionTypes.Search;

  constructor(public payload: string) {}
}

export class SearchComplete implements Action {
  readonly type = TaskActionTypes.SearchComplete;

  constructor(public payload: Task[]) {}
}

export class SearchError implements Action {
  readonly type = TaskActionTypes.SearchError;

  constructor(public payload: string) {}
}

export class Load implements Action {
  readonly type = TaskActionTypes.Load;

  constructor(public payload: Task) {}
}

export class Select implements Action {
  readonly type = TaskActionTypes.Select;

  constructor(public payload: string) {}
}

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type TaskActions =
  | Search
  | SearchComplete
  | SearchError
  | Load
  | Select;
