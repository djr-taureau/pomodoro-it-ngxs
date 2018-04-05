import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../models/task';

@Component({
  selector: 'bc-task-detail',
  template: `
    <mat-card *ngIf="task">
      <mat-card-title-group>
        <mat-card-title color="primary">{{ content }}</mat-card-title>
        <mat-card-subtitle color="secondary" *ngIf="projectId">{{ projectId }}</mat-card-subtitle>
        <img mat-card-sm-image *ngIf="thumbnail" [src]="thumbnail"/>
      </mat-card-title-group>
      <mat-card-content>
        <p [innerHtml]="id"></p>
      </mat-card-content>
      <mat-card-footer class="footer">
      </mat-card-footer>
      <mat-card-actions align="start">
      <button mat-raised-button color="warn" *ngIf="inCollection" (click)="remove.emit(task)">
        Remove Task from Collection
      </button>
      <button mat-raised-button color="primary" *ngIf="!inCollection" (click)="add.emit(task)">
      Add Task to Collection
      </button>
        <button mat-raised-button color="primary"><i class="material-icons">play_arrow</i></button>
        <button mat-raised-button color="primary"><i class="material-icons">pause</i></button>
      </mat-card-actions>
    </mat-card>

  `,
  styles: [
    `
    :host {
      display: flex;
      justify-content: center;
      margin: 75px 0;
    }
    mat-card {
      max-width: 600px;
    }
    mat-card-title-group {
      margin-left: 0;
    }
    img {
      width: 60px;
      min-width: 60px;
      margin-left: 5px;
    }
    mat-card-content {
      margin: 15px 0 50px;
    }
    mat-card-actions {
      margin: 25px 0 0 !important;
    }
    mat-card-footer {
      padding: 0 25px 25px;
      position: relative;
    }
  `,
  ],
})
export class TaskDetailComponent {
  /**
   * Presentational components receive data through @Input() and communicate events
   * through @Output() but generally maintain no internal state of their
   * own. All decisions are delegated to 'container', or 'smart'
   * components before data updates flow back down.
   *
   * More on 'smart' and 'presentational' components: https://gist.github.com/btroncone/a6e4347326749f938510#utilizing-container-components
   */
  @Input() task: Task;
  @Input() inCollection: boolean;
  @Output() add = new EventEmitter<Task>();
  @Output() remove = new EventEmitter<Task>();

  /**
   * Tip: Utilize getters to keep templates clean
   */
  get id() {
    console.log(this.task.id);
    console.log(this.inCollection);
    //WTF with the task ids
    return this.task.id;
  }

  get content() {
    return this.task.content;
  }

  get projectId() {
    return this.task.project_id;
  }

  get comment_count() {
    return this.task.comment_count;
  }

  // get description() {
  //   return this.task.due.date;
  // }

  get thumbnail() {
    return false;
  }
}
