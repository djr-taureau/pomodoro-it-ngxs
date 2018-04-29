import { Action } from '@ngrx/store';
import { Pomo } from '../models/Pomo';

export enum PomoActionTypes {
  Search = '[Pomo] Search',
  SearchComplete = '[Pomo] Search Complete',
  SearchError = '[Pomo] Search Error',
  Load = '[Pomo] Load',
  Select = '[Pomo] Select',
}

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handPomo/advanced-types.html#discriminated-unions
 */
export class Search implements Action {
  readonly type = PomoActionTypes.Search;

  constructor(public payload: string) {}
}

export class SearchComplete implements Action {
  readonly type = PomoActionTypes.SearchComplete;

  constructor(public payload: Pomo[]) {}
}

export class SearchError implements Action {
  readonly type = PomoActionTypes.SearchError;

  constructor(public payload: string) {}
}

export class Load implements Action {
  readonly type = PomoActionTypes.Load;

  constructor(public payload: Pomo) {}
}

export class Select implements Action {
  readonly type = PomoActionTypes.Select;

  constructor(public payload: string) {}
}

/**
 * Export a type alias of all actions in this action group
 * so that reducers can easily compose action types
 */
export type PomoActions =
  | Search
  | SearchComplete
  | SearchError
  | Load
  | Select;
