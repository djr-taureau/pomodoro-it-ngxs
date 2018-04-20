import { RouterStateSnapshot } from '@angular/router';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../models/task';
import {MatTableDataSource} from '@angular/material';

@Component({
  selector: 'bc-pomo-tracker',
  template: `
    <div class="mdl-cell mdl-cell--6-col">
      <div class="pomo-container mat-elevation-z8">
        <div class="pomo-header">
          <mat-form-field>
            <input matInput (keyup)="applyFilter($event.target.value)" placeholder="Filter">
          </mat-form-field>
        </div>

      <mat-table #table [dataSource]="dataSource">

        <!-- Position Column -->
        <ng-container matColumnDef="position">
          <mat-header-cell *matHeaderCellDef> No. </mat-header-cell>
          <mat-cell *matCellDef="let pomo"> {{pomo.position}} </mat-cell>
        </ng-container>

        <!-- Name Column -->
        <ng-container matColumnDef="notes">
          <mat-header-cell *matHeaderCellDef> Notes </mat-header-cell>
          <mat-cell *matCellDef="let pomo"> {{pomo.notes}} </mat-cell>
        </ng-container>

        <!-- date Column -->
        <ng-container matColumnDef="date">
          <mat-header-cell *matHeaderCellDef> date </mat-header-cell>
          <mat-cell *matCellDef="let pomo"> {{pomo.date}} </mat-cell>
        </ng-container>

        <!-- Symbol Column -->
        <ng-container matColumnDef="startTime">
          <mat-header-cell *matHeaderCellDef> Start Time </mat-header-cell>
          <mat-cell *matCellDef="let pomo"> {{pomo.startTimel}} </mat-cell>
        </ng-container>

        <!-- Symbol Column -->
        <ng-container matColumnDef="endTime">
          <mat-header-cell *matHeaderCellDef> End Time </mat-header-cell>
          <mat-cell *matCellDef="let pomo"> {{pomo.endTimel}} </mat-cell>
        </ng-container>

        <ng-container matColumnDef="isSubmitted">
          <mat-header-cell *matHeaderCellDef> Submit </mat-header-cell>
          <mat-cell *matCellDef="let pomo"><mat-checkbox [checked]="pomo.isPublish"></mat-checkbox></mat-cell>
        </ng-container>

        <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
        <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>
      </mat-table>
    </div>
  </div>


  `,
  styles: [
    `
    :host {
      display: flex;
      justify-content: center;
      margin: 75px 0;
    }
    .pomo-container {
      display: center;
      flex-direction: column;
      min-width: 700px;
      max-width: 700px;
    }
    .pomo-header {
      min-height: 64px;
      padding: 8px 24px 0;
    }
    .mat-form-field {
      font-size: 14px;
      width: 100%;
    }
    .mat-table {
      overflow: auto;
      max-height: 300px;
    }

  `,
  ],
})
export class PomoTrackerComponent {

  //TODO: THE POMO TRACKER COMPONENT IS GOING TO BECOME A CHILD COMPONENT
  displayedColumns = ['position', 'notes', 'date', 'startTime', 'endTime', 'isSubmitted'];
  dataSource = new MatTableDataSource(POMO_DATA);

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
}


export interface Pomo {
  position: number;
  notes: string;
  date: string;
  startTime: string;
  endTime: string;
  isSubmitted: boolean;
}
const POMO_DATA: Pomo[] = [
  {position: 1, notes: 'added new timer function', date: '03-21-18', startTime: '09:05', endTime: '09:30', isSubmitted: false},
  {position: 2, notes: 'completed timer service', date: '03-21-18', startTime: '09:05', endTime: '09:30', isSubmitted: false},
  {position: 3, notes: 'added new data table', date: '03-21-18', startTime: '09:05', endTime: '09:30', isSubmitted: false},
  {position: 4, notes: 'fixed issues with ngrx store', date: '03-21-18', startTime: '09:05', endTime: '09:30', isSubmitted: false},
  {position: 5, notes: 'worked on external api', date: '03-21-18', startTime: '09:05', endTime: '09:30', isSubmitted: false},
  {position: 6, notes: 'completed oauth', date: '03-21-18', startTime: '09:05', endTime: '09:30', isSubmitted: false},
  {position: 7, notes: 'fixed issue with task toggle button', date: '03-21-18', startTime: '09:05', endTime: '09:30', isSubmitted: false},
  {position: 8, notes: 'researched voice activation', date: '03-21-18', startTime: '09:05', endTime: '09:30', isSubmitted: false},
  {position: 9, notes: 'added new material components', date: '03-21-18', startTime: '09:05', endTime: '09:30', isSubmitted: false},
  {position: 10, notes: 'worked on pomo tracker component', date: '03-21-18', startTime: '09:05', endTime: '09:30', isSubmitted: false},
  {position: 11, notes: 'completd login function', date: '03-21-18', startTime: '09:05', endTime: '09:30', isSubmitted: false},
  {position: 12, notes: 'fixed data table issues', date: '03-21-18', startTime: '09:05', endTime: '09:30', isSubmitted: false},
];
