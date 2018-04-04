import { Injectable } from '@angular/core';


@Injectable()
export class PomoService {
  // inject the task service
  constructor() { }

  workTime: 1500; //should be 1500
  shortBreakTime: 300; // should be 300
  longBreakTime: 1800; // should be 1800
  workCycles: 4;
  pomoCountComplete: number;
  pomoStartTime: Date;
  pomoEndTime: any;
  pomoDuration: any;
  project: any;
  task: any;
  notes: any;

  initPomo() {
    //pomoService
    this.pomoCountComplete = 0;
    this.workTime = 1500;
  }


}