import { Pomo } from '../models/pomo';

export class Search {
  static readonly type = '[Pomo] Search';
  constructor(public payload: string) {}
}

export class SearchComplete {
  static readonly type = '[Pomo] Search Complete';
  constructor(public payload: Pomo[]) {}
}

export class SearchError {
  static readonly type = '[Pomo] Search Error';
  constructor(public payload: string) {}
}
export class Load {
  static readonly type = '[Pomo] Load';
  constructor(public payload: Pomo) {}
}
export class SelectPomo {
  static readonly type = '[Pomo] Select';

  constructor(public payload: string) {}
}
export class AddPomo {
  static readonly type = '[Pomo] Add Pomo';
  constructor(public payload: Pomo) {}
}

export class AddPomoSuccess {
  static readonly type = '[Pomo] Add Pomo Success';
  constructor(public payload: Pomo) {}
}
export class AddPomoFail {
  readonly type = '[Pomo] Add Pomo Fail';
  constructor(public payload: Pomo) {}
}
export class RemovePomo {
  static readonly type = '[Pomo] Remove Pomo';
  constructor(public payload: Pomo) {}
}
export class RemovePomoSuccess {
  static readonly type = '[Pomo] Remove Pomo Success';
  constructor(public payload: Pomo) {}
}
export class RemovePomoFail {
  static readonly type = '[Pomo] Remove Pomo Fail';
  constructor(public payload: Pomo) {}
}
export class LoadPomos {
  static readonly type = '[Pomo] Load';
}export class LoadPomosSuccess {
  static readonly type = '[Pomo] Load Pomos Success';
  constructor(public payload: Pomo[]) {}
}
export class LoadPomosFail {
  static readonly type = '[Pomo] Load Pomos Failure';
  constructor(public payload: any) {}
}

// TODO Add enums for these

