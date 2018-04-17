import { PomoTimerService } from './../../core/services/pomo-timer';
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { Store, select } from '@ngrx/store';
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
      [inCollection]="isSelectedTaskInCollection$ | async"
      [timeRemaining]="this.timeRemaining"
      [pomoTitle]="this.pomoTitle"
      [pomoCount]="this.pomoCount"
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
  countdownSeconds$: number;
  pomoTitle;
  pomoCount;
  pomosCompleted;
  //timeRemaining;
  // testTimer$ = this.timerSource.asObservable();
  interval$;
  pause$;
  resume$;
  $timer;
  // $timer = this.timerSource.asObservable();
  timer$;
  buttonState;
  buttonAction;
  timerToggle;
  timerStarted;


  //TODO add timer service subscription to constructor
  //TODO make timerService private
  constructor(public pomoTimerService: PomoTimerService, private store: Store<fromTasks.State>) {
    this.task$ = store.pipe(select(fromTasks.getSelectedTask));
    this.isSelectedTaskInCollection$ = store.pipe(
      select(fromTasks.isSelectedTaskInCollection)
    );
  }

  ngOnInit(): void {
   this.pomoCount = 0;
   this.pomosCompleted = 0;
   this.timeRemaining = 4;
   this.pomoTitle = 'Time to Work';
   this.initTimer();
   //this.pomoTimerService.timer$.subscribe(val = this.countdownSeconds = countdownSeconds);
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
    if (event.currentTarget.attributes.id.nodeValue === 'resume' && !this.timerStarted) {
      this.timerStarted = true;
      this.startTimer();
      // this.timerTick();
    }
    // const resume$ = fromEvent($event, `${event.type}`).pipe(mapTo(true));
    // console.log(resume$);
  }

  // resumeTimer(event) {
  //   // placeholder
  //   // if not pomoInit start pomo
  //   // if pomoCount = 0 set to 1 otherwise add 1
  //   //
  //   this.pomoTimerService.startTimer(event);
  // }

  // startTimer (event: any) {
  //   this.pomoTimerService.startTimer(event);
  // }

  // toggleTimer() {
  //   // toggle timer
  //   this.pomoTimerService.startTimer(event);
  // }

  // timerTick() {
  //   this.pomoTimerService.$timer = this.pomoTimerService.timer$.subscribe(
  //     timeRemaining => {
  //       this.timeRemaining = timeRemaining;
  //       console.log('from Sub:' + this.timeRemaining);
  //     }
  //   );
  //   return this.pomoTimerService.$timer;
  // }

  initTimer () {
    //pomoService
    //this.pomoCount = 1;
    //this.pomosCompleted = 1500;
    this.timerStarted = false;

    if (this.pomoCount % 8 === 0 && this.pomoCount !== 0) {
      // this.timeRemaining = 1800;
      this.countdownSeconds$ = 3;
      this.pomoTitle = 'Real Break';
      this.pomoCount = 0;
      this.pomosCompleted += 1;
    } else if (this.pomoCount % 2 === 0 && this.pomoCount !== 0) {
      // this.timeRemaining = 300;
      this.countdownSeconds$ = 4;
      this.pomoTitle = 'Time to Break';
      this.pomoCount += 1;
      this.pomosCompleted += 1;
      } else {
        // this.timeRemaining = 1500;
        this.countdownSeconds$ = 6;
        this.pomoTitle = 'Time to Work';
        this.pomoCount += 1;
      }

    }

  // toggleTimer(event) {

  // }

  //TODO: Save this to show to Ben before removing
  startTimer() {
    //this.buttonState = event.currentTarget.attributes.name.nodeValue;
    //this.buttonAction = event.currentTarget.attributes.id.nodeValue;
    //this.timerToggle = (this.buttonAction === 'resume') ? true : false;
    const resumeButton = document.getElementById('resume');
    const pauseButton = document.getElementById('pause');
    const resetButton = document.getElementById('reset');
    const interval$: any = interval(1000).pipe(mapTo(-1));
    const pause$ = fromEvent(pauseButton, 'click').pipe(mapTo(false));
    const resume$ = fromEvent(resumeButton, 'click').pipe(mapTo(true));

    this.timer$ = merge(pause$, resume$).pipe(
      startWith(interval$),
      switchMap(val => (val ? interval$ : empty())),
      scan((acc, curr) => (curr ? curr + acc : acc), this.countdownSeconds$),
      takeWhile(v => v >= 0),
    )
    .subscribe(
      val => {
        this.timeRemaining = val;
        this.timeRemaining = this.timeRemaining + 'tick';
        if (this.timeRemaining === 0) {
          console.log('timer done');
          this.resetTimer();
        }
      },
      () => { this.resetTimer(); });
    if (this.timeRemaining === 0) {
      console.log('timer is completed');
    }
  }

  resetTimer() {
    this.initTimer();
  }


  pauseTimer() {
    // placeholder
  }
}
