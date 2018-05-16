import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ComponentsModule } from './components';
import { TaskExistsGuard, TaskGuard } from './guards';
import { FindTaskPageComponent } from './containers/find-task-page';
import { ViewTaskPageComponent } from './containers/view-task-page';
import { SelectedTaskPageComponent, PomoDialogComponent } from './containers/selected-task-page';
import { CollectionPageComponent } from './containers/collection-page';
import { MaterialModule } from '../material';
import {MatDialogModule} from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { CollectionState } from './store';

import { NgxsModule } from '@ngxs/store';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    MatDialogModule,
    ReactiveFormsModule,
    ComponentsModule,
    RouterModule.forChild([
      { path: 'find', component: FindTaskPageComponent },
      {
        path: ':id',
        component: ViewTaskPageComponent,
        canActivate: [TaskExistsGuard],
      },
      { path: '', component: CollectionPageComponent },
    ]),
    NgxsModule.forFeature(CollectionState),
  ],
  declarations: [
    FindTaskPageComponent,
    ViewTaskPageComponent,
    SelectedTaskPageComponent,
    CollectionPageComponent,
    PomoDialogComponent
  ],
  entryComponents: [
    PomoDialogComponent,
    SelectedTaskPageComponent
  ],
  providers: [],
})
export class TasksModule {}
