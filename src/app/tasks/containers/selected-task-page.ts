import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as fromTasks from '../reducers';
import * as collection from '../actions/collection';
import { Task } from '../models/task';
import { MinuteSecondsPipe } from '../../shared/pipes/timer-pipe';
import { PomoTimerService } from '../../core/services/pomo-timer';

@Component({
  selector: 'bc-selected-task-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
  <div class="mdl-grid">
    <bc-task-detail
      [task]="task$ | async"
      [inCollection]="isSelectedTaskInCollection$ | async"
      [timeRemaining]="this.pomoTimerService.timeRemaining"
      [pomoTitle]="this.pomoTimerService.pomoTitle$"
      [pomoCount]="this.pomoTimerService.pomoCount$"
      (add)="addToCollection($event)"
      (remove)="removeFromCollection($event)"
      (resume)="startTimer($event)"
      (pause)="pauseTimer($event)"
      (reset)="resetTimer($event)">
    </bc-task-detail>
    <bc-pomo-tracker></bc-pomo-tracker>
    </div>
  `,

})
export class SelectedTaskPageComponent implements OnInit {
  task$: Observable<Task>;
  countdownSeconds: any;
  isSelectedTaskInCollection$: Observable<boolean>;
  //TODO add timer service subscription to constructor
  //TODO make timerService private
  constructor(public pomoTimerService: PomoTimerService, private store: Store<fromTasks.State>) {
    this.task$ = store.pipe(select(fromTasks.getSelectedTask));
    this.isSelectedTaskInCollection$ = store.pipe(
      select(fromTasks.isSelectedTaskInCollection)
    );
  }

  ngOnInit(): void {
   this.pomoTimerService.pomoCount$ = 0;
   this.pomoTimerService.pomosCompleted$ = 0;
   this.pomoTimerService.initTimer();
   //this.pomoTimerService.timer$.subscribe(val = this.countdownSeconds = countdownSeconds);
  }

  addToCollection(task: Task) {
    this.store.dispatch(new collection.AddTask(task));
  }

  removeFromCollection(task: Task) {
    this.store.dispatch(new collection.RemoveTask(task));
  }

  resumeTimer(event) {
    // placeholder
    // if not pomoInit start pomo
    // if pomoCount = 0 set to 1 otherwise add 1
    //
    this.pomoTimerService.startTimer(event);
  }

  startTimer(event: any) {
    this.pomoTimerService.startTimer(event);
  }

  toggleTimer() {
    // toggle timer
    this.pomoTimerService.startTimer(event);
  }

  pauseTimer() {
    // placeholder
  }

  resetTimer() {
    // placeholder
    this.pomoTimerService.initTimer();
  }
}
