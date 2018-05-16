import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import * as firebase from 'firebase/app';
import { Authenticate } from '../models/user';
import { Observable } from 'rxjs/Observable';
import {NgxOAuthClient, NgxOAuthResponse, DefaultHeaders, Configuration} from 'ngx-oauth-client';
import { TodoistApiAuth } from './todoist-api-auth';
import { AngularFireAuth } from 'angularfire2/auth';
import 'rxjs/add/operator/switchMap';

interface User {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
  favoriteColor?: string;
}
// export const authConfig: AuthConfig = {
//   issuer: 'https://todoist.com/oauth/authorize',
//   redirectUri: 'http://localhost:4200/tasks',
//   clientId: 'bloc-capstone',
// };
// state=PipU9sG8&code=c5d6a801f4979d6eb1ead836ba045b0b2ca2693e
// second call http://localhost:4200/login?state=PipU9sG8&code=01bc75e11d028180870cf5e3c85afa2fdda1edce
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  clientId: '928cd4baca4f456790059633990eaa2e';
  secretString: 'PipU9sG8';
  scope: 'data:read_write';
  oAuthUrl: '`https://todoist.com/oauth/authorize?client_id=${this.clientId}&scope=data:read_write&state=${this.secretString}`';
  fullUrl: 'https://todoist.com/oauth/authorize?client_id=928cd4baca4f456790059633990eaa2e&scope=data:read_write&state=PipU9sG8';
  todoistAuth;
  todoistRes;
  user$: Observable<User>;

  constructor(public http: HttpClient, public todoist: TodoistApiAuth,
              private afAuth: AngularFireAuth, private afs: AngularFirestore,
            private router: Router) {
    // this.configureWithNewConfigApi();
    this.user$ = this.afAuth.authState
      .switchMap(user => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return Observable.of(null);
        }
      });
  }

  // private configureWithNewConfigApi() {
  //   this.oauthService.configure(authConfig);

  //   this.oauthService.tokenValidationHandler = new JwksValidationHandler();
  //   // this.oauthService.initImplicitFlow('http://localhost/tasks');
  //   // this.oauthService.tryLogin({
  //   //   onTokenReceived: (info) => {
  //   //     console.log('state', info.state);
  //   //   }
  //   // });
  //   this.oauthService.loadDiscoveryDocumentAndTryLogin();
  // }

  loginWithGoogle(auth) {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);

  }

  private oAuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        this.updateUserData(credential.user);
      });
  }

  updateUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const data:  User = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL
    };
    return userRef.set(data, { merge: true});
  }

  todoistLogin ({username, password}: Authenticate): Observable<User> {
    this.todoistTest();
    this.todoistAuth = this.http.get(this.oAuthUrl)
    .subscribe(
      response => console.log('where is it', response),
      err => console.log(err)
    );
    // this.todoistRes = { name: 'David', state: 'response' };
    return of(this.todoistRes);
    // this.oauthService.customQueryParams = {
    //   client_id: this.clientId,
    //   scope: this.scope,
    //   state: this.secretString
    // };
    // this.oauthService.initImplicitFlow();
    // this.oauthService.tryLogin({
    //   onTokenReceived: context => {
    //     console.log('logged in');
    //     console.log(context);
    //   }
    // });
  }

  todoistTest() {
    this.todoist.getToken().subscribe((token: NgxOAuthResponse) => {
      this.todoist.fetchToken('access_token');
    });
  }

  logout() {
    // this.oauthService.logOut();
    this.afAuth.auth.signOut().then(() => {
      this.router.navigate(['/']);
    });
    return of(true);
  }
}
