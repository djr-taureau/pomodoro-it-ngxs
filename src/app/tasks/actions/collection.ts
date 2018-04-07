import { Action } from '@ngrx/store';
import { Task } from '../models/Task';

export enum CollectionActionTypes {
  AddTask = '[Collection] Add Task',
  AddTaskSuccess = '[Collection] Add Task Success',
  AddTaskFail = '[Collection] Add Task Fail',
  RemoveTask = '[Collection] Remove Task',
  RemoveTaskSuccess = '[Collection] Remove Task Success',
  RemoveTaskFail = '[Collection] Remove Task Fail',
  Load = '[Collection] Load',
  LoadSuccess = '[Collection] Load Success',
  LoadFail = '[Collection] Load Fail',
}

/**
 * Add Task to Collection Actions
 */
export class AddTask implements Action {
  readonly type = CollectionActionTypes.AddTask;

  constructor(public payload: Task) {}
}

export class AddTaskSuccess implements Action {
  readonly type = CollectionActionTypes.AddTaskSuccess;

  constructor(public payload: Task) {}
}

export class AddTaskFail implements Action {
  readonly type = CollectionActionTypes.AddTaskFail;

  constructor(public payload: Task) {}
}

/**
 * Remove Task from Collection Actions
 */
export class RemoveTask implements Action {
  readonly type = CollectionActionTypes.RemoveTask;

  constructor(public payload: Task) {}
}

export class RemoveTaskSuccess implements Action {
  readonly type = CollectionActionTypes.RemoveTaskSuccess;

  constructor(public payload: Task) {}
}

export class RemoveTaskFail implements Action {
  readonly type = CollectionActionTypes.RemoveTaskFail;

  constructor(public payload: Task) {}
}

/**
 * Load Collection Actions
 */
export class Load implements Action {
  readonly type = CollectionActionTypes.Load;
}

export class LoadSuccess implements Action {
  readonly type = CollectionActionTypes.LoadSuccess;

  constructor(public payload: Task[]) {}
}

export class LoadFail implements Action {
  readonly type = CollectionActionTypes.LoadFail;

  constructor(public payload: any) {}
}

export type CollectionActions =
  | AddTask
  | AddTaskSuccess
  | AddTaskFail
  | RemoveTask
  | RemoveTaskSuccess
  | RemoveTaskFail
  | Load
  | LoadSuccess
  | LoadFail;
