import { Routes } from '@angular/router';
import { AuthGuard } from './auth/services/auth-guard.service';
import { NotFoundPageComponent } from './core/containers/not-found-page';

export const routes: Routes = [
  { path: '', redirectTo: '/tasks', pathMatch: 'full' },
  {
    path: 'tasks',
    loadChildren: './tasks/tasks.module#TasksModule',
    canActivate: [AuthGuard],
  },
  { path: '**', component: NotFoundPageComponent },
];
