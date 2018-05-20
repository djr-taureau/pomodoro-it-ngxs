import { AUTH_ROUTES } from './../../auth/auth.module';
import { Injectable, InjectionToken, Optional, Inject } from '@angular/core';
import { State, Action, StateContext, Selector, Actions, ofAction, ofActionDispatched } from '@ngxs/store';
import { Subject } from 'rxjs/Subject';
import { Task } from '../models/task';
import { Pomo } from '../models/pomo';
import * as task from '../store/task.actions';
import { TodoistTasksService } from '../../services/todoist-tasks';
import { TaskService } from '../../services/task-service';
import { AuthService } from '../../auth/services/auth.service';
import { asapScheduler, of, Observable } from 'rxjs';

import {
  catchError, map, switchMap, toArray,
  mergeMap, debounceTime, takeUntil, skip, tap
} from 'rxjs/operators';

export class AddTask {
  static readonly type = '[Collection} AddTask';
  constructor(public payload: Task) {}
}

export class AddTaskSuccess {
  static readonly type = '[Collection} AddTaskSuccess';
  constructor(public payload: Task) {}
}

export class AddTaskFail {
  static readonly type = '[Collection} AddTaskFail';
  constructor(public payload: Task) {}
}

export class RemoveTask {
  static readonly type = '[Collection} RemoveTask';
  constructor(public payload: Task) {}
}

export class RemoveTaskSuccess {
  static readonly type = '[Collection} AddTask';
  constructor(public payload: Task) {}
}

export class RemoveTaskFail {
  static readonly type = '[Collection} AddTask';
  constructor(public payload: Task) {}
}

export class Load {
  static readonly type = '[Collection} Load';
}

export class LoadSuccess {
  static readonly type = '[Collection} Load Success';
  constructor(public payload: Task[]) {}
}

export class LoadFail {
  static readonly type = '[Collection} Load Fail';
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
