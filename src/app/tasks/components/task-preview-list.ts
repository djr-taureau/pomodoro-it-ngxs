import { Component, Input } from '@angular/core';
import { Task } from '../models/task';

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
