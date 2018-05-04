import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { timer } from 'rxjs/observable/timer';
import { interval } from 'rxjs/observable/interval';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { merge } from 'rxjs/observable/merge';
import { empty } from 'rxjs/observable/empty';
import { switchMap, scan, takeWhile, startWith, mapTo, map, filter, last, tap } from 'rxjs/operators';
import { takeUntil } from 'rxjs/operators/takeUntil';
import { Subscription } from 'rxjs/Subscription';
import { TimerObservable } from 'rxjs/observable/TimerObservable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';


@Injectable()
export class PomoTimerService {
  // inject the task service
  constructor() { }

  timerSource$ = new BehaviorSubject(null);

  countdownSeconds$;
  pomoTitle$;
  pomoCount$;
  pomosCompleted$;
  pomosCycleCompleted$;
  interval$;
  pause$;
  resume$;
  $timer: Observable<any>;
  timerStarted;
  timeRemaining;
  audio;
  notesEntry;

  // setState(state: any) {
  //   this.timerSource$.next(state); .====
  // }

  // getState(): Observable<any> {
  //   return this.timerSource$.asObservable();
  // }
  private buttons;

  initTimer(buttons) {
    this.buttons = buttons;
    this.initTimerParameters();
  }

  initTimerParameters () {
    this.timerStarted = false;

    switch (this.pomoCount$) {
      case 1:
      case 3:
      case 5:
        this.pomoTitle$ = 'Time to Work';
        this.countdownSeconds$ = 5; // 1500
        this.timerSource$.next(this.countdownSeconds$);
        this.notesEntry = false;
        break;
      case 7:
        this.pomoTitle$ = 'Time to Work';
        this.countdownSeconds$ = 5; // 1500
        this.pomosCompleted$ += 1;
        this.timerSource$.next(this.countdownSeconds$);
        this.notesEntry = false;
        break;
      case 2:
      case 4:
      case 6:
        this.pomoTitle$ = 'Time to Rest';
        this.countdownSeconds$ = 3; // 300
        this.pomosCompleted$ += 1;
        this.timerSource$.next(this.countdownSeconds$);
        this.notesEntry = true;
        break;
      case 8:
        this.pomoTitle$ = 'Time for a Long Break';
        this.countdownSeconds$ = 8; // 1800
        this.pomosCycleCompleted$ += 1;
        this.timerSource$.next(this.countdownSeconds$);
        this.notesEntry = true;
        this.pomosCompleted$ = 0;
        this.pomoCount$ = 0;
        break;
      default:
        console.log('do what');
    }

    }

  startTimer() {
    this.timerStarted = true;

    const interval$: any = interval(1000).pipe(mapTo(-1));
    const pause$ = fromEvent(this.buttons.pauseButton.nativeElement, 'click').pipe(mapTo(false));
    const resume$ = fromEvent(this.buttons.resumeButton.nativeElement, 'click').pipe(mapTo(true));

    const timer$ = merge(pause$, resume$).pipe(
      startWith(true),
      switchMap(val => (val ? interval$ : empty())),
      scan((acc, curr) => (curr ? curr + acc : acc), this.countdownSeconds$),
      takeWhile(v => v >= 0),
      tap(val => console.log('timeRemaining', val)),
      tap(val => {
        if (val === 0) {
          this.pomoCount$ += 1;
          console.log(this.pomoCount$);
          console.log('completed', this.pomosCompleted$);
          console.log('cycles', this.pomosCycleCompleted$);
          this.timerStarted = false;
          this.initTimerParameters();
        }
      }),
    );
    timer$.subscribe(val => this.timerSource$.next(val));
  }

  resetTimer() {
    this.initTimerParameters();
  }

  soundAlarm() {
    this.audio = new Audio();
    this.audio.src = '../../../assets/Grandfather-clock-chimes.mp3';
    this.audio.load();
    this.audio.play();
  }
  stopSoundAlarm() {
    this.audio.pause();
  }
}
