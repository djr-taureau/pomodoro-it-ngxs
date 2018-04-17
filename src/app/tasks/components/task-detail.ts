import { Subscription } from 'rxjs/Subscription';
import { RouterStateSnapshot } from '@angular/router';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../models/task';
import { PomoTimerService } from '../../core/services/pomo-timer';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'bc-task-detail',
  template: `
    <div class="grid-2 mdl-grid">
    <div class="mdl-cell mdl-cell--6-col">
    <mat-card *ngIf="task">
      <mat-card-title-group>
        <mat-card-title color="primary">{{ content }}</mat-card-title>
        <mat-card-subtitle color="secondary">{{ pomoTitle }}</mat-card-subtitle>
        <mat-card-subtitle>{{ time  }}</mat-card-subtitle>
      </mat-card-title-group>
      <mat-card-content>
        <p>{{ pomoCount }}</p>
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
        <button id="resume" name="resumeButton" class="resume-btn"
          mat-raised-button color="primary" (click)="resumeCommand($event)"><i class="material-icons">play_arrow</i></button>
        <button id="pause" name="pauseButton" class="pause-btn"
          mat-raised-button color="primary" (click)="resumeCommand($event)"><i class="material-icons">pause</i></button>
        <button id="reset" name="resetButton" class="reset-btn"
          mat-raised-button color="primary" (click)="resumeCommand($event)"><i class="material-icons">stop</i></button>
      </mat-card-actions>
    </mat-card>
    </div>

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

  @Input() task: Task;
  @Input() inCollection: boolean;
  @Input() pomoCount: number;
  @Input() pomoTitle: number;
  @Input() timeRemaining: any;
  @Input() timerSubscription: Subscription;
  @Output() add = new EventEmitter<Task>();
  @Output() remove = new EventEmitter<Task>();
  // @Output() resume = resumeTimer();
  @Output() resumeClicked = new EventEmitter();
  // @Output() pauseClicked = new EventEmitter();
  // @Output() resetClicked = new EventEmitter();

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

  get time() {
    return this.timeRemaining;
  }

  // this.timerSubscription = this.pomoTimerService.getState().subscribe(
  //   timeRemaining => {
  //     this.timeRemaining = timeRemaining;
  //     console.log('from Sub:' + this.timeRemaining);
  //   }
  // );

  resumeCommand(action: any) {
    this.resumeClicked.emit(action);
  }
}
