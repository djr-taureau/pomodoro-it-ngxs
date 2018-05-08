import { AddPomo } from './../actions/task';
import { PomoTimerService } from './../../core/services/pomo-timer';
import { Component, ViewEncapsulation,
  OnInit, OnDestroy, AfterViewInit, ChangeDetectionStrategy, Output, Input,
  EventEmitter, Inject, Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import * as fromTasks from '../reducers';
import * as collection from '../actions/collection';
import * as taskPomo from '../actions/task';
import { Task } from '../models/task';
import { Pomo } from '../models/pomo';
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
import * as moment from 'moment';
import { UUID } from 'angular2-uuid';
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
      (addPomo)="addPomoToTask($event)"
      (remove)="removeFromCollection($event)"
      (resumeClicked)="resumeClicked($event)"
      (pauseClicked)="resumeClicked($event)"
      (reset)="resumeClicked($event)">
    </bc-task-detail>
    <bc-pomo-tracker [pomos]="pomos$ | async"></bc-pomo-tracker>
    </div>
  `,

})

export class SelectedTaskPageComponent implements OnInit, AfterViewInit {
  task$: Observable<Task>;
  pomos$: Observable<Pomo[]>;
  timeRemaining: any;
  isSelectedTaskInCollection$: Observable<boolean>;
  timerSource = new BehaviorSubject(null);
  pomoDialogRef: MatDialogRef<PomoDialogComponent>;
  dialogResult: any;
  dialogRef;
  pomos;
  pomo;
  taskIds;



  constructor(private dialog: MatDialog,
              public pomoTimerService: PomoTimerService,
              private store: Store<fromTasks.State>) {
    this.task$ = store.pipe(select(fromTasks.getSelectedTask));
    // this.pomos = store.pipe(select(fromTasks.getPomos));
    console.log('this task ', this.task$);
    this.isSelectedTaskInCollection$ = store.pipe(
      select(fromTasks.isSelectedTaskInCollection)
    );
    this.taskIds = store.pipe(select(fromTasks.getCollectionTaskIds));
    this.pomos = store.pipe(select(fromTasks.getPomoIds));
    this.pomoTimerService.timerSource$ = this.timerSource;
    // console.log(this.isSelectedTaskInCollection$);
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
   // this.store.dispatch(new collection.LoadPomos());
    console.log('this task ', this.task$);
    console.log('this pomos ', this.pomos$);
    console.log('are these the taskIds', this.taskIds);
    console.log('show me the pomoIds', this.pomos);
    // this.pomos$.pipe().subscribe(pomo => {
    //   console.log(pomo);
    // });
  //  this.store.select(fromTasks.getTaskPomos).subscribe(pomos => {
  //    this.pomos$ = pomos;
  //    console.log(this.pomos$);
  //  });
     //TODO Starting Point for Sunday
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

  addPomoToTask(pomo: Pomo) {
    this.store.dispatch(new taskPomo.AddPomo(pomo));
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
    console.log(this.task$);
    if (event.currentTarget.attributes.id.nodeValue === 'resume' && !this.pomoTimerService.timerStarted) {
      this.pomoTimerService.timerStarted = true;
      this.pomoTimerService.startTimer();
      this.pomoTimerService.stopSoundAlarm();
      this.pomoTimerService.timerSource$.next(this.pomoTimerService.countdownSeconds$);
    }
    if (event.currentTarget.attributes.id.nodeValue === 'reset') {
      this.pomoTimerService.resetTimer();
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

  generateUUID() {
    return UUID.UUID();
  }

  openPomoDialog () {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '700px';
    dialogConfig.data = {
      id: '',
      content: ''
    };

    this.task$.pipe().subscribe(id => console.log(id));
    this.task$.pipe()
      .subscribe(
        task => {
          dialogConfig.data.id = task.id,
          dialogConfig.data.content = task.content;
        });

    this.dialogRef = this.dialog.open(PomoDialogComponent, dialogConfig);

    this.dialogRef.afterClosed().subscribe(data => {
      this.dialogResult = data;
      this.pomo = {
        id: this.generateUUID(),
        task_id: data.id,
        notes: data.notes,
        date: data.date
      };
      this.addPomoToTask(this.pomo);
      console.log('new countdown', this.pomoTimerService.countdownSeconds$);
      this.timerSource.next(this.pomoTimerService.countdownSeconds$);
    });
  }
}
@Component({
  selector: 'app-pomo-dialog',
  template: `
  <h2 mat-dialog-title>{{ content }}</h2>
  <mat-dialog-content [formGroup]="form" connectForm="pomo">
  <mat-form-field>
      <input matInput formControlName="id" [disabled]="true" value="{{ id }}">
    </mat-form-field>
    <mat-form-field>
      <input matInput formControlName="date" [disabled]="true">
    </mat-form-field>
    <mat-form-field>
    <input matInput placeholder="Enter your notes" formControlName="notes">
  </mat-form-field>
  </mat-dialog-content>
  <mat-dialog-actions>
    <button class="mat-raised-button" (click)="close()">Close</button>
    <button class="mat-raised-button mat-primary" (click)="save($event)">Save</button>
  </mat-dialog-actions>
  `
})

export class PomoDialogComponent implements OnInit {

  @Input() task: Task;
  @Output() savePomo = new EventEmitter<Pomo>();
  form: FormGroup;
  content;
  id;
  pomo;

  constructor(private pomoTimerService: PomoTimerService,
              private store: Store<fromTasks.State>,
              private fb: FormBuilder,
              public dialogRef: MatDialogRef<PomoDialogComponent>,
              @Inject(MAT_DIALOG_DATA) data
              ) {
                this.form = data;
                this.id = data.id;
                this.content = data.content;
              }

              ngOnInit() {
                this.form = this.fb.group({
                  id: this.id,
                  date: new Date(),
                  notes: ''
                });
              }

              save($event) {
                console.log(MAT_DIALOG_DATA);
                console.log(this.pomo);
                this.savePomo.emit(this.pomo);
                // console.log('event', $event);
                // console.log('savepomo', this.savePomo.emit($event));
                this.pomoTimerService.stopSoundAlarm();
                this.dialogRef.close(this.form.value);
              }
              close() {
                this.pomoTimerService.stopSoundAlarm();
                this.dialogRef.close('Cancel');
              }
}




