import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TaskDetailComponent } from './task-detail';
import { TaskPreviewComponent } from './task-preview';
import { TaskPreviewListComponent } from './task-preview-list';
import { TaskSearchComponent } from './task-search';
import { PomoTrackerComponent} from './pomo-tracker';
import { PipesModule } from '../../shared/pipes';
import { MaterialModule } from '../../material';

export const COMPONENTS = [
  TaskDetailComponent,
  TaskPreviewComponent,
  TaskPreviewListComponent,
  TaskSearchComponent,
  PomoTrackerComponent
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule,
    PipesModule,
  ],
  declarations: COMPONENTS,
  exports: COMPONENTS,
})
export class ComponentsModule {}
