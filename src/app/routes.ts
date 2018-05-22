import { Routes } from '@angular/router';
import { AuthenticatedGuard } from './auth/auth.guard';
import { NotFoundPageComponent } from './core/containers/not-found-page';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
// import { NotFoundPageComponent } from './core/containers/not-found-page';

export const routes: Routes = [
  { path: '', redirectTo: '/tasks', pathMatch: 'full' },
  {
    path: 'tasks',
    loadChildren: './tasks/tasks.module#TasksModule',
    // canActivate: [AuthenticatedGuard],
  },
   { path: '**', component: NotFoundPageComponent },
];
