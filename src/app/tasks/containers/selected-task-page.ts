import { Component, ViewEncapsulation,
        OnInit, OnDestroy, AfterViewInit,
        ChangeDetectionStrategy, Output, Input,
        EventEmitter, Inject, Injectable } from '@angular/core'; //
import { Store, Select } from '@ngxs/store';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs/Observable';
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
import { LoadTask, SelectTask, AddTask, RemoveTask } from '../store';
import { ActivatedRoute, Params, NavigationCancel, NavigationError, Router, RouterStateSnapshot, RoutesRecognized } from '@angular/router';
import { PomoTimerService } from '../../services/pomo-timer';
import { isDoStatement } from 'typescript';
import { TaskState, SearchState, CollectionState } from '../store';
@Component({
  selector: 'bc-selected-task-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <div class="mdl-grid">
    <bc-task-detail
      [task]="task$ | async"
      [inCollection]="this.isTaskInCollection()"
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
    <bc-pomo-tracker></bc-pomo-tracker>
    </div>
  `,

})

export class SelectedTaskPageComponent implements OnInit, AfterViewInit {

  @Select(TaskState) taskState$: Observable<any>;
  @Select(CollectionState) CollectionState$: Observable<any>;
  @Select(TaskState.SelectedTaskId) selectedTaskId: any;
  @Select() task$: Observable<Task>;
  // @Select(CollectionState.IsTaskInCollection) isSelectedTaskinCollection$: Observable<boolean>;
  // isSelectedTaskInCollection;
  // pomos$: Observable<Pomo[]>;
  timeRemaining: any;
  timerSource = new BehaviorSubject(null);
  pomoDialogRef: MatDialogRef<PomoDialogComponent>;
  dialogResult: any;
  dialogRef;
  pomos;
  pomo;
  taskIds;
  task;

  constructor(private dialog: MatDialog,
              public pomoTimerService: PomoTimerService,
              private store: Store,
              private route: ActivatedRoute) {

      this.task$ = this.store.dispatch(new LoadTask(this.selectedTaskId)).pipe(
        data => this.task = data
      );
      // this.isSelectedTaskinCollection$ = this.store.select(IsTaskInCollection);
      this.pomoTimerService.timerSource$ = this.timerSource;
    }

  ngOnInit(): void {
   // this.task$ = this.store.dispatch(new LoadTask(this.selectedTaskId));
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

  }

  isTaskInCollection(): boolean {
    const selectedTask = this.store.selectSnapshot(TaskState.SelectedTaskId);
    const collectionIds = this.store.selectSnapshot(CollectionState.CollectionIds);
    return collectionIds.indexOf(this.selectedTaskId) > -1;
  }

  addToCollection(task: Task) {
    this.store.dispatch(new AddTask(task));
  }

  addPomoToTask(pomo: Pomo) {
    // this.store.dispatch(new AddPomo(pomo));
  }

  removeFromCollection(task: Task) {
    this.store.dispatch(new RemoveTask(task));
  }

  resumeClicked(event) {
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
      // this.addPomoToTask(this.pomo);
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

  @Select(TaskState) taskState$: Observable<any>;
  @Select(SearchState) searchState$: Observable<any>;
  @Select(CollectionState) collectionState$: Observable<any>;
  @Select(TaskState.Tasks) tasks$: Observable<Task[]>;
  @Input() task: Task;
  @Output() savePomo = new EventEmitter<Pomo>();
  form: FormGroup;
  content;
  id;
  pomo;

  constructor(private pomoTimerService: PomoTimerService,
              private store: Store,
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
                  date: Date.now(),
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




