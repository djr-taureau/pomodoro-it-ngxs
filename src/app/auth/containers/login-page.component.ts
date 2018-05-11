import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { LoginWithGoogle } from '../auth.actions';

import { Store } from '@ngxs/store';
@Component({
  selector: 'bc-login-page',
  template: `
    <bc-login-form (submitted)="onSubmit($event)">
    </bc-login-form>
  `,
  styles: [],
})
export class LoginPageComponent {
  items: Observable<any[]>;

  constructor(private store: Store, db: AngularFirestore) {
    this.items = db.collection('items').valueChanges();
  }


  onSubmit() {
    this.store.dispatch(new LoginWithGoogle());
    // this.store.dispatch(new Auth.TodoistLogin($event));
  }
}
