import { PomoTimerService } from './../../core/services/pomo-timer';
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import * as fromTasks from '../reducers';
import * as collection from '../actions/collection';
import { Task } from '../models/task';
import { Injectable} from '@angular/core';
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

@Component({
  selector: 'bc-selected-task-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <div class="mdl-grid">
    <bc-task-detail
      [task]="task$ | async"
      [inCollection]="isSelectedTaskInCollection$"
      [timeRemaining]="this.pomoTimerService.timeRemaining"
      [simpleObservable]="this.simpleObservable | async"
      [pomoTitle]="this.pomoTimerService.pomoTitle$"
      [pomoCount]="this.pomoTimerService.pomoCount$"
      [seconds]="this.pomoTimerService.timeRemaining"
      (checkTime)="checkCurrentTime($event)"
      (add)="addToCollection($event)"
      (remove)="removeFromCollection($event)"
      (resumeClicked)="resumeClicked($event)"
      (resumeClicked)="resumeClicked($event)"
      (reset)="resumeClicked($event)">
    </bc-task-detail>
    <bc-pomo-tracker></bc-pomo-tracker>
    </div>
  `,

})
export class SelectedTaskPageComponent implements OnInit {
  task$: Observable<Task>;
  timeRemaining: any;
  private timerSubscription: Subscription;
  isSelectedTaskInCollection$: Observable<boolean>;
  timerSource = new Subject<any>();
  simpleObservable;
  countDown: any;
  counter: number;
  seconds: string;
  private subscription: Subscription;
  checkTime;

  constructor(public pomoTimerService: PomoTimerService, private store: Store<fromTasks.State>) {
    this.task$ = store.pipe(select(fromTasks.getSelectedTask));
    this.isSelectedTaskInCollection$ = store.pipe(
      select(fromTasks.isSelectedTaskInCollection)
    );
  }

  ngOnInit(): void {
   this.pomoTimerService.pomoCount$ = 0;
   this.pomoTimerService.pomosCompleted$ = 0;
   this.pomoTimerService.pomoTitle$ = 'Time to Work';
   this.pomoTimerService.initTimer();
  }

  addToCollection(task: Task) {
    this.store.dispatch(new collection.AddTask(task));
  }

  removeFromCollection(task: Task) {
    this.store.dispatch(new collection.RemoveTask(task));
  }

  resumeClicked(event) {
    console.log(event);
    //console.log(event.id['nodeValue']);
    //TODO: save to show to Ben before removing
    console.log(event.target);
    console.log(event.srcElement);
    console.log(event.type);
    console.log(event.currentTarget.attributes.name.nodeValue);
    console.log(event.currentTarget.attributes.id.nodeValue);
    if (event.currentTarget.attributes.id.nodeValue === 'resume' && !this.pomoTimerService.timerStarted) {
      this.pomoTimerService.timerStarted = true;
      this.pomoTimerService.startTimer();
    }
  }

  checkCurrentTime(event) {
    this.counter = event;
  }
  // startTimer (event: any) {
  //   this.pomoTimerService.startTimer(event);
  //
}
