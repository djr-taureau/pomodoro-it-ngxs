import { Task } from '../models/task';
import { Pomo } from '../models/pomo';

export class Search {
  static readonly type = '[Task] Search';
  constructor(public payload: string) {}
}
export class SearchComplete {
  static readonly type = '[Task] Search Complete';
  constructor(public payload: Task[]) {}
}

export class SearchError {
  static readonly type = '[Task] Search Complete';
}

export class LoadSearchTasks {
  static readonly type = '[Task] Load all Searched Tasks';
  constructor(public payload: Task[]) {}
}
export class SelectTask {
  static readonly type = '[Task] Select';
  constructor(public payload: string) {}
}
export class LoadTask {
  static readonly type = '[Task] Load';
  constructor(public payload: Task) {}
}
