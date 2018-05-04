import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatChipsModule} from '@angular/material/chips';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {
  MatNativeDateModule,
  MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatSidenavModule,
  MatListModule,
  MatIconModule,
  MatToolbarModule,
  MatProgressSpinnerModule,
  MatTableModule,
  MatCheckboxModule,
} from '@angular/material';

@NgModule({
  imports: [
    MatNativeDateModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule
  ],
  exports: [
    MatNativeDateModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule
  ],
})
export class MaterialModule {}
