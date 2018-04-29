import { MinuteSecondsPipe } from './../../shared/pipes/timer-pipe';
import { Subscription } from 'rxjs/Subscription';
import { RouterStateSnapshot } from '@angular/router';
import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Task } from '../models/task';
import { PomoTimerService } from '../../core/services/pomo-timer';
import { Observable } from 'rxjs/Observable';
import { filter } from 'rxjs/operators';
import {MatDialog, MatDialogConfig, MAT_DIALOG_DATA} from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

//TODO add new

@Component({
  selector: 'bc-task-detail',
  template: `
    <div class="grid-2 mdl-grid">
    <div class="mdl-cell mdl-cell--6-col">
    <mat-card *ngIf="task">
      <mat-card-title-group>
        <mat-card-title color="primary">{{ content }}</mat-card-title>
        <mat-card-title>{{ pomoTitle }} - {{ timerService.timerSource$ | async | minutesSeconds }}</mat-card-title>
      </mat-card-title-group>
      <mat-card-content>
        <mat-chip-list>
        <mat-chip>Pomo</mat-chip>
        <mat-chip>Pomo</mat-chip>
        <mat-chip color="primary" selected="true">Pomo</mat-chip>
        <mat-chip color="accent" selected="true">Pomo</mat-chip>
      </mat-chip-list>
      </mat-card-content>
      <mat-card-footer class="footer">

      </mat-card-footer>
      <mat-card-actions align="start">
      <button mat-raised-button color="warn" (click)="remove.emit(task)">
        Remove Task from Collection
      </button>
      <button mat-raised-button color="primary" (click)="add.emit(task)">
      Add Task to Collection
      </button>
        <button #resume id="resume" name="resumeButton" class="resume-btn"
          mat-raised-button color="primary" (click)="resumeCommand($event)"><i class="material-icons">play_arrow</i></button>
        <button #pause id="pause" name="pauseButton" class="pause-btn"
          mat-raised-button color="primary" (click)="resumeCommand($event)"><i class="material-icons">pause</i></button>
        <button #reset id="reset" name="resetButton" class="reset-btn"
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
    .progress-bar-container {
      width: 100%;
      mat-progress-bar {
        margin: 20px 0;
      }
    }
    .progress-bar-spacer {
      display: inline-block;
      width: 50px;
    }
    .progress-bar-controls {
      margin: 10px 0;
    }
  `,
  ],
})
export class TaskDetailComponent implements AfterViewInit {

  @Input() task: Task;
  @Input() inCollection: boolean;
  @Input() pomoCount: number;
  @Input() pomoTitle: number;
  @Input() pomosCompleted: number;
  @Output() add = new EventEmitter<Task>();
  @Output() remove = new EventEmitter<Task>();
  @Output() resumeClicked = new EventEmitter();


  constructor(public timerService: PomoTimerService, element: ElementRef) {}

  @ViewChild('resume', {read: ElementRef}) resumeButton;
  @ViewChild('pause', {read: ElementRef}) pauseButton;
  @ViewChild('reset', {read: ElementRef}) resetButton;

  ngAfterViewInit() {
    const buttons = {
      resumeButton: this.resumeButton,
      pauseButton: this.pauseButton,
      resetButton: this.resetButton,
    };
    this.timerService.initTimer(buttons);
    //TODO Show Ben: issues from last night
    this.timerService.timerSource$.next(this.timerService.countdownSeconds$);
  }


  get id() {
    console.log('wtf', this.task.id);
    console.log('is the fucking task there?', this.inCollection);
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


  get thumbnail() {
    return false;
  }

  resumeCommand(action: any) {
    this.resumeClicked.emit(action);
  }

}
