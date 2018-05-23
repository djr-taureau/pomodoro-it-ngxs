import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxsModule } from '@ngxs/store';
import { Router, RouterModule } from '@angular/router';
import { ComponentsModule } from './components';
import { TaskExistsGuard, TaskGuard } from './guards';
import { FindTaskPageComponent } from './containers/find-task-page';
import { ViewTaskPageComponent } from './containers/view-task-page';
import { SelectedTaskPageComponent, PomoDialogComponent } from './containers/selected-task-page';
import { CollectionPageComponent } from './containers/collection-page';
import { MaterialModule } from '../material';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { TaskState, CollectionState, SearchState } from './store';



@NgModule({
  imports: [
    NgxsModule.forFeature([TaskState, CollectionState, SearchState]),
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
        canActivate: [TaskExistsGuard], // keep working on this
      },
      { path: '', component: CollectionPageComponent },
    ]),
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
