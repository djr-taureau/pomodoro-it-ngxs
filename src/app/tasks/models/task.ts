
import { StrInt } from './task';
export type Due = {
  date: string;
  datetime?: string;
  string: string;
  timezone?: string;
};

export class Task {
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
}

export type GetTaskParameters = {
  project_id?: number;
  label_id?: number;
  filter?: string;
  lang?: string;
};

export class Project {
  comment_count: number;
  id: number;
  readonly indent: number;
  name: string;
  readonly order: number;
}

export class Comment {
  id: number;
  task_id: number;
  project_id: number;
  posted: string;
  content: string;
  attachment?: Attachment;

}

export class Attachment {
  /** the name of the file */
  file_name: string;
  /** The size of the file in bytes */
  file_size: number;
  /** MIME type (i.e. text/plain, image/png) */
  file_type: string;
  /**
   * The URL where the file is located (a string value representing an HTTP URL).
   * Note that we don’t cache the remote content on our servers and stream or expose files directly from third party resources.
   * In particular this means that you should avoid providing links to non-encrypted (plain HTTP) resources,
   * as exposing this files in Todoist may issue a browser warning.
   */
  file_url: string;
  /** Upload completion state */
  upload_state: 'pending' | 'completed';
}
export type StrInt = string | number;
