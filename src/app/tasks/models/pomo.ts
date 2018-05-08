
export class Pomo {
  id: any;
  date: any;
  notes: string;
  task_id: any;
}

import { StrInt } from './task';
export type Due = {
  date: string;
  datetime?: string;
  string: string;
  timezone?: string;
};

export interface Task {
  comment_count: number;
  completed: boolean;
  content: string;
  due: Due;
  id: any;
  readonly indent: number;
  label_ids: number[];
  readonly order: number;
  readonly project_id: number;
  url: string;
  pomos?: Pomo[];
}





