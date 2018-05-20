import { AuthTokenService } from './auth/services/auth-token.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientXsrfModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { CoreModule } from './core/core.module';
import { AuthModule } from './auth/auth.module';
import { NgxsModule } from '@ngxs/store';
import { routes } from './routes';
import { AppComponent } from './core/containers/app';
import { environment } from '../environments/environment';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AuthState } from './auth';

import { AppState } from './tasks/store';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';


@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    ReactiveFormsModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'My-Xrsf-Cookie',
      headerName: 'My-Xsrf-Header'
    }),

    // RouterModule.forRoot(routes, { useHash: true }),
    RouterModule.forRoot(routes),
    NgxsModule.forRoot([]),
    NgxsRouterPluginModule.forRoot(),
    NgxsReduxDevtoolsPluginModule.forRoot({maxAge: 5}),
    // NgxsLoggerPluginModule.forRoot(),
    CoreModule,
    AuthModule,
  ],
  providers: [
    // { provide: RouterStateSerializer, useClass: CustomRouterStateSerializer },
    // { provide: HTTP_INTERCEPTORS , useClass: AuthTokenService, multi: true},
  ],
  bootstrap: [AppComponent],
  declarations: [],
})
export class AppModule {}
