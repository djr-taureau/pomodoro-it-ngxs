import { Routes } from '@angular/router';
import { AuthenticatedGuard } from './auth/auth.guard';
import { NotFoundPageComponent } from './core/containers/not-found-page';
// import { NotFoundPageComponent } from './core/containers/not-found-page';

export const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  {
    path: 'tasks',
    loadChildren: './tasks/tasks.module#TasksModule',
    // canActivate: [AuthGuard],
  },
   { path: '**', component: NotFoundPageComponent },
];
