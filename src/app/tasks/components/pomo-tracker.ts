import { getPomosState } from './../reducers/index';
import { LoadPomos } from './../actions/task';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterStateSnapshot } from '@angular/router';
import { Component, OnInit, Input, Output, EventEmitter, Injectable } from '@angular/core';
import { Pomo } from '../models/pomo';
import {MatTableDataSource} from '@angular/material';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/obserable/of';
import { DataSource } from '@angular/cdk/collections';
import * as fromTasks from '../reducers';
import * as taskPomo from '../actions/task';
// import { LoadPomos } from '../actions/task';


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


        <!-- Name Column -->
        <ng-container matColumnDef="date">
          <mat-header-cell *matHeaderCellDef> Date </mat-header-cell>
          <mat-cell *matCellDef="let pomo"> {{ date }} </mat-cell>
        </ng-container>

        <!-- date Column -->
        <ng-container matColumnDef="notes">
          <mat-header-cell *matHeaderCellDef> Notes </mat-header-cell>
          <mat-cell *matCellDef="let pomo"> {{ notes }} </mat-cell>
        </ng-container>


        <ng-container matColumnDef="isSubmitted">
          <mat-header-cell *matHeaderCellDef> Submit </mat-header-cell>
          <mat-cell *matCellDef="let pomo"><mat-checkbox [checked]="isPublish"></mat-checkbox></mat-cell>
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
export class PomoTrackerComponent implements OnInit {

  //TODO: THE POMO TRACKER COMPONENT IS GOING TO BECOME A CHILD COMPONENT
  displayedColumns = ['date', 'notes', 'isSubmitted'];
  dataSource: any | null;
  index: number;
  id: string;
  selectedPomoId: string;

  pomos$: Observable<Pomo[]>;

  constructor(private store: Store<fromTasks.State>) {
  }

  ngOnInit() {
    console.log('hold it for pomo tracker');
    this.store.dispatch(new taskPomo.LoadPomos);
    this.pomos$.subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
    });
    this.dataSource.filterPredicate = function(data, filter): boolean {
      return data.state.toLowerCase() === filter;
    };
  }



  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
}


