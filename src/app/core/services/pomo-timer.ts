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

  private timerStartedSource = new Subject();
  countdownSeconds$: number;
  pomoTitle$;
  pomoCount$;
  pomosCompleted$;
  timeRemaining: any;
  interval$;
  pause$;
  resume$;
  timer$;

  initTimer () {
    //pomoService
    //this.pomoCount = 1;
    //this.pomosCompleted = 1500;

    if (this.pomoCount$ % 8 === 0 && this.pomoCount$ !== 0) {
      this.timeRemaining = 1800;
      this.countdownSeconds$ = 1800;
      this.pomoTitle$ = 'Real Break';
      this.pomoCount$ = 0;
      this.pomosCompleted$ += 1;
    } else if (this.pomoCount$ % 2 === 0 && this.pomoCount$ !== 0) {
      this.timeRemaining = 300;
      this.countdownSeconds$ = 300;
      this.pomoTitle$ = 'Time to Break';
      this.pomoCount$ += 1;
      this.pomosCompleted$ += 1;
      } else {
        this.timeRemaining = 1500;
        this.countdownSeconds$ = 1500;
        this.pomoTitle$ = 'Time to Work';
        this.pomoCount$ += 1;
      }

    }

  toggleTimer(event) {
    this.startTimer(event);
  }

  startTimer(event) {
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
      val => { this.timeRemaining = val; },
      () => {
        this.resetTimer();
    });
  }

  resetTimer() {
    this.initTimer();
  }



}
