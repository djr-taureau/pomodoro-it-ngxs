import { Task } from '../models/task';
import { Pomo } from '../models/pomo';


export class AddTask {
  static readonly type = '[Collection] Add Task';
  constructor(public payload: Task) {}
}
export class AddTaskSuccess {
  static readonly type = '[Collection] Add Task Success';

  constructor(public payload: Task) {}
}
export class AddTaskFail {
  static readonly type = '[Collection] Add Task Fail';
  constructor(public payload: Task) {}
}
export class RemoveTask {
  static readonly type = '[Collection] Remove Task';
  constructor(public payload: Task) {}
}
export class RemoveTaskSuccess {
  static readonly type = '[Collection] Remove Task Success';
  constructor(public payload: Task) {}
}
export class RemoveTaskFail {
  static readonly type = '[Collection] Remove Task Fail';
  constructor(public payload: Task) {}
}
export class LoadTask {
  static readonly type = '[Task] Load';
  constructor(public payload: Task) {}
}
export class LoadTaskSuccess {
  static readonly type = '[Tasks] Load Success';
  constructor(public payload: Task[]) {}
}
export class LoadTaskFail {
  static readonly type = '[Collection] Load Fail';
  constructor(public payload: any) {}
}
export class Search {
  static readonly type = '[Task] Search';
  constructor(public payload: string) {}
}
export class SearchComplete {
  static readonly type = '[Task] Search Complete';
  constructor(public payload: Task[]) {}
}
export class SearchError {
  static readonly type = '[Task] Search Error';
  constructor(public payload: string) {}
}
export class SelectTask {
  static readonly type = '[Task] Select';
  constructor(public payload: string) {}
}
export class Load {
  static readonly type = '[All Task] Load';
  constructor(public payload: Task[]) {}
}
export class LoadSuccess {
  static readonly type = '[All Task] Load Success';
}
export class LoadFail {
  static readonly type = '[All Task] Load Fail';
  constructor(public payload: any) {}
}
