import { PomoTimerService } from './../../core/services/pomo-timer';
import { Component, ViewEncapsulation,
  OnInit, OnDestroy, AfterViewInit, ChangeDetectionStrategy, Output, Input,
  EventEmitter, Inject, Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import * as fromTasks from '../reducers';
import * as collection from '../actions/collection';
import { Task } from '../models/task';
import { Subject } from 'rxjs/Subject';
import { timer } from 'rxjs/observable/timer';
import { interval } from 'rxjs/observable/interval';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { merge } from 'rxjs/observable/merge';
import { empty } from 'rxjs/observable/empty';
import { switchMap, scan, takeWhile, startWith, mapTo, map, filter, last } from 'rxjs/operators';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { Subscription } from 'rxjs/Subscription';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'bc-selected-task-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <div class="mdl-grid">
    <bc-task-detail
      [task]="task$ | async"
      [inCollection]="isSelectedTaskInCollection$"
      [pomoTitle]="this.pomoTimerService.pomoTitle$"
      [pomoCount]="this.pomoTimerService.pomoCount$"
      [pomosCompleted]="this.pomoTimerService.pomosCompleted$"
      (add)="addToCollection($event)"
      (remove)="removeFromCollection($event)"
      (resumeClicked)="resumeClicked($event)"
      (pauseClicked)="resumeClicked($event)"
      (reset)="resumeClicked($event)">
    </bc-task-detail>
    <bc-pomo-tracker></bc-pomo-tracker>
    </div>
  `,

})

export class SelectedTaskPageComponent implements OnInit, AfterViewInit {
  task$: Observable<Task>;
  timeRemaining: any;
  isSelectedTaskInCollection$: Observable<boolean>;
  timerSource = new BehaviorSubject(null);
  pomoDialogRef: MatDialogRef<PomoDialogComponent>;
  dialogResult: any;
  dialogRef;


  constructor(private dialog: MatDialog, public pomoTimerService: PomoTimerService, private store: Store<fromTasks.State>) {
    this.task$ = store.pipe(select(fromTasks.getSelectedTask));
    this.isSelectedTaskInCollection$ = store.pipe(
      select(fromTasks.isSelectedTaskInCollection)
    );
    this.pomoTimerService.timerSource$ = this.timerSource;
    console.log(this.isSelectedTaskInCollection$);
  }

  ngOnInit(): void {
    //TODO Move to child component
   this.pomoTimerService.pomoCount$ = 1;
   this.pomoTimerService.pomosCompleted$ = 0;
   this.pomoTimerService.pomosCycleCompleted$ = 0;
   this.pomoTimerService.notesEntry = true;
   this.pomoTimerService.pomoTitle$ = 'Time to Work';
   this.pomoTimerService.countdownSeconds$ = 6;
   this.timerSource.next(this.pomoTimerService.countdownSeconds$);
   this.timerSource = this.pomoTimerService.timerSource$;
   this.timerSource.pipe().subscribe(val => {
    /* do something with the value */
    if (val === 0 && !this.pomoTimerService.timerStarted) {
      this.pomoTimerService.soundAlarm();
      if (this.pomoTimerService.notesEntry) {
          this.openPomoDialog();
        }
      }
    });
  }

  ngAfterViewInit() {
  //
  }

  addToCollection(task: Task) {
    this.store.dispatch(new collection.AddTask(task));
  }

  removeFromCollection(task: Task) {
    this.store.dispatch(new collection.RemoveTask(task));
  }

  resumeClicked(event) {
    console.log(event);
    console.log(event.target);
    console.log(event.srcElement);
    console.log(event.type);
    console.log(event.currentTarget.attributes.name.nodeValue);
    console.log(event.currentTarget.attributes.id.nodeValue);
    if (event.currentTarget.attributes.id.nodeValue === 'resume' && !this.pomoTimerService.timerStarted) {
      this.pomoTimerService.timerStarted = true;
      this.pomoTimerService.startTimer();
      this.pomoTimerService.timerSource$.next(this.pomoTimerService.countdownSeconds$);
    }
  }



  pauseClicked(event) {
    console.log(event);
    console.log(event.target);
    console.log(event.srcElement);
    console.log(event.type);
    console.log(event.currentTarget.attributes.name.nodeValue);
    console.log(event.currentTarget.attributes.id.nodeValue);
    this.pomoTimerService.startTimer();
    this.timerSource.pipe(
    ).subscribe(value => {
      /* do something with the value */
      console.log('checking value for dialog', value);
    });
    this.pomoTimerService.timerSource$ = this.timerSource;
  }

  openPomoDialog () {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    // dialogConfig.height = '200px';
    // dialogConfig.width = '400px';

    dialogConfig.data = {
      id: 1,
      project: 'Bloc Capstone',
      task: 'finish stupid timer',
      notes: ''
    };

    this.dialogRef = this.dialog.open(PomoDialogComponent, dialogConfig);

    this.dialogRef.beforeClose().subscribe(data => {
      console.log(`Dialog closed: ${data}`);
      console.log('new countdown', this.pomoTimerService.countdownSeconds$);
      this.timerSource.next(this.pomoTimerService.countdownSeconds$);
      // this.timerSource.next(this.pomoTimerService.countdownSeconds$);
    });
  }

}

@Component({
  selector: 'app-pomo-dialog',
  template: `
  <h2 mat-dialog-title>{{ task }} {{ project }}</h2>
  <mat-dialog-content [formGroup]="form">
    <mat-form-field>
      <input matInput placeholder="Enter your notes">
    </mat-form-field>
  </mat-dialog-content>
  <mat-dialog-actions>
    <button class="mat-raised-button" (click)="close()">Close</button>
    <button class="mat-raised-button mat-primary" (click)="save()">Save</button>
  </mat-dialog-actions>
  `
})

export class PomoDialogComponent implements OnInit {

  form: FormGroup;
  project: string;
  task: string;
  notes: string;

  constructor(private pomoTimerService: PomoTimerService, private fb: FormBuilder, public dialogRef: MatDialogRef<PomoDialogComponent>,
              @Inject(MAT_DIALOG_DATA) data) {
                this.task = data.task;
                this.project = data.project;
                this.notes = data.notes;
              }

              ngOnInit() {
                this.form = this.fb.group({
                  notes: [this.notes]
                });
              }
              save() {
                console.log(MAT_DIALOG_DATA);
                this.pomoTimerService.stopSoundAlarm();
                this.dialogRef.close(this.form.value);
              }
              close() {
                this.pomoTimerService.stopSoundAlarm();
                this.dialogRef.close('Cancel');
              }
}




