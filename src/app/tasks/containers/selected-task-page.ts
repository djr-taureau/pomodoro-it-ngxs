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
import { TimerObservable } from 'rxjs/observable/TimerObservable'

@Component({
  selector: 'bc-selected-task-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <div class="mdl-grid">
    <bc-task-detail
      [task]="task$ | async"
      [inCollection]="isSelectedTaskInCollection$ | async"
      [timeRemaining$]="this.pomoTimerService.timeRemaining$"
      [pomoTitle]="this.pomoTimerService.pomoTitle"
      [pomoCount]="this.pomoTimerService.pomoCount"
      (add)="addToCollection($event)"
      (remove)="removeFromCollection($event)"
      (timerClicked)="timerClicked($event)"
      (timerClicked)="timerClicked($event)"
      (timerClicked)="timerClicked($event)">
    </bc-task-detail>
    <bc-pomo-tracker></bc-pomo-tracker>
    </div>
  `,

})
export class SelectedTaskPageComponent implements OnInit {
  task$: Observable<Task>;
  timeRemaining$: any;
  private timerSubscription: Subscription;
  isSelectedTaskInCollection$: Observable<boolean>;

  //TODO add timer service subscription to constructor
  //TODO make timerService private
  constructor(public pomoTimerService: PomoTimerService, private store: Store<fromTasks.State>) {
    this.task$ = store.pipe(select(fromTasks.getSelectedTask));
    this.isSelectedTaskInCollection$ = store.pipe(
      select(fromTasks.isSelectedTaskInCollection)
    );
    // this.timerSubscription = this.pomoTimerService.interval$.subscribe(
    //   timeRemaining => {
    //     this.timeRemaining$ = timeRemaining;
    //     console.log('TIME FUCKING REMAIN!:' + timeRemaining);
    //   }
    // );
  }

  ngOnInit(): void {
    this.pomoTimerService.initTimer();
   //this.pomoTimerService.timer$.subscribe(val = this.countdownSeconds = countdownSeconds);
  }

  addToCollection(task: Task) {
    this.store.dispatch(new collection.AddTask(task));
  }

  removeFromCollection(task: Task) {
    this.store.dispatch(new collection.RemoveTask(task));
  }



  timerClicked(event) {
    console.log(event);
    console.log(event.id['nodeValue']);
    //TODO: save to show to Ben before removing
    console.log(event.target);
    console.log(event.srcElement);
    console.log(event.type);
    console.log(event.currentTarget.attributes.name.nodeValue);
    console.log(event.currentTarget.attributes.id.nodeValue);

    if (event.currentTarget.attributes.id.nodeValue === 'resume') {
      //this.pomoTimerService.start();
      console.log('resume')
    }

    if (event.currentTarget.attributes.id.nodeValue === 'pause') {

      //this.pomoTimerService.pause();
      console.log('pause')
    }

    if (event.currentTarget.attributes.id.nodeValue === 'reset') {

      //this.pomoTimerService.pause();
      console.log('reset')
    }

    // const resume$ = fromEvent($event, `${event.type}`).pipe(mapTo(true));
    // console.log(resume$);
  }



  pauseTimer() {
    // placeholder
  }

  // resetTimer() {
  //   // placeholder
  //   this.pomoTimerService.initTimer();
  // }
}
