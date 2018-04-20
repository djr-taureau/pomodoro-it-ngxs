import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
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
@Injectable()
export class PomoTimerService {
  // inject the task service
  constructor() { }

  timerSource = new Subject<any>();
  countdownSeconds$: number;
  pomoTitle$;
  pomoCount$;
  pomosCompleted$;
  timeRemaining;
  // testTimer$ = this.timerSource.asObservable();
  interval$;
  pause$;
  resume$;
  $timer
  // $timer = this.timerSource.asObservable();
  timer$;
  buttonState;
  buttonAction;
  timerToggle;
  timerStarted;
  checkTime: any;

  setState(state: any) {
    this.timerSource.next(state);
  }

  getState(): Observable<any> {
    return this.timerSource.asObservable();
  }

  initTimer () {
    //pomoService
    //this.pomoCount = 1;
    //this.pomosCompleted = 1500;
    this.timerStarted = false;

    if (this.pomoCount$ % 8 === 0 && this.pomoCount$ !== 0) {
      // this.timeRemaining = 1800;
      this.countdownSeconds$ = 3;
      this.timeRemaining = this.countdownSeconds$;
      this.pomoTitle$ = 'Real Break';
      this.pomoCount$ = 0;
      this.pomosCompleted$ += 1;
    } else if (this.pomoCount$ % 2 === 0 && this.pomoCount$ !== 0) {
      // this.timeRemaining = 300;
      this.countdownSeconds$ = 4;
      this.timeRemaining = this.countdownSeconds$;
      this.pomoTitle$ = 'Time to Break';
      this.pomoCount$ += 1;
      this.pomosCompleted$ += 1;
      } else {
        // this.timeRemaining = 1500;
        this.countdownSeconds$ = 6;
        this.timeRemaining = this.countdownSeconds$;
        this.pomoTitle$ = 'Time to Work';
        this.pomoCount$ += 1;
      }

    }

  // toggleTimer(event) {

  // }
  // TODO figure out why the async pipe is still not working
  // Timer built with code from
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

    const timer$ = merge(pause$, resume$).pipe(
      startWith(interval$),
      switchMap(val => (val ? interval$ : empty())),
      scan((acc, curr) => (curr ? curr + acc : acc), this.countdownSeconds$),
      takeWhile(v => v >= 0),
    )
    .subscribe(
      val => { this.timeRemaining = val; console.log(this.timeRemaining); },
      val => { this.checkTime.emit(val); },
      () => {
        this.resetTimer();
    });
    // .subscribe(
    //   val => {
    //     this.timeRemaining = val;
    //     if (this.timeRemaining === 0) {
    //       console.log('timer done');
    //       this.resetTimer();
    //     }
    //   },
    //   () => { this.resetTimer(); });
    // if (this.timeRemaining === 0) {
    //   console.log('timer is completed');
    // }
  }

  resetTimer() {
    this.initTimer();
  }



}
