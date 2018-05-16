import { TodoistTasksService } from './../../services/todoist-tasks';
import { Component, Input } from '@angular/core';
import { Task } from '../models/task';
import { Observable } from 'rxjs/Observable';
import { Store, Select, ofAction, Actions } from '@ngxs/store';
import { TaskState } from '../store';


@Component({
  selector: 'bc-task-preview-list',
  template: `
    <bc-task-preview *ngFor="let task of tasks" [task]="task"></bc-task-preview>
  `,
  styles: [
    `
    :host {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
    }
  `,
  ],
})
export class TaskPreviewListComponent {
  @Input() tasks: Task[];
}
