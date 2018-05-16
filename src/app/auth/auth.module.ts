import { CommonModule } from '@angular/common';
import {NgxOAuthModule} from 'ngx-oauth-client';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxsModule } from '@ngxs/store';
import { LoginPageComponent } from './containers/login-page.component';
import { LoginFormComponent } from './components/login-form.component';
import { MaterialModule } from './../material/material.module';
import { AuthState } from './auth.state';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AuthenticatedGuard } from './auth.guard';
import { TodoistApiAuth } from './services/todoist-api-auth';
export const COMPONENTS = [LoginPageComponent, LoginFormComponent];

export const AUTH_ROUTES: Routes = [
  { path: 'login', component: LoginPageComponent  },
];

@NgModule({
  imports: [
    NgxOAuthModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    MaterialModule,

    RouterModule.forChild(AUTH_ROUTES),

    NgxsModule.forFeature([
      AuthState,
    ]),
  ],
  declarations: [
    COMPONENTS,
  ],
  exports: COMPONENTS,
})
export class AuthModule {}
