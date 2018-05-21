import 'rxjs/add/observable/throw';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError, switchMap } from 'rxjs/operators';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Task } from '../tasks/models/task';
import { Pomo } from '../tasks/models/pomo';
import * as taskActions from '../tasks/store/task.actions';
import { FirestoreService } from './firestore-service';
// fix DB issues
@Injectable({
  providedIn: 'root'
})
export class TaskService {

  task: Observable<Task>;
  pomo: Observable<Pomo>;

  constructor(private afs: AngularFirestore, private fireService: FirestoreService) { }


  addTask(task: Task) {
    return this.fireService.add('tasks', task);
  }


  addPomo(pomo: Pomo) {
    const ref = this.afs.doc<Pomo>(`pomos/${pomo.id}`);
    return Observable.fromPromise( ref.set(pomo) );
  }
  getTasks$(): Observable<Task[]> {
    return this.afs.collection<Task>('tasks').valueChanges();
  }

  getPomos$(): Observable<Pomo[]> {
    return this.afs.collection<Pomo>('pomos').valueChanges();
  }
  // updatePizza(payload: Pizza): Observable<Pizza> {
  //   return this.http
  //     .put<Pizza>(`/api/pizzas/${payload.id}`, payload)
  //     .pipe(catchError((error: any) => Observable.throw(error.json())));
  // } // see if it worked

  // removePizza(payload: Pizza): Observable<Pizza> {
  //   return this.http
  //     .delete<any>(`/api/pizzas/${payload.id}`)
  //     .pipe(catchError((error: any) => Observable.throw(error.json())));
  // }
  // create$: Observable<Action> = this.actions$.ofType(actions.CREATE)
  //       .map((action: actions.Create) => action.pizza )
  //       .switchMap(pizza => {
  //           const ref = this.afs.doc<fromPizza.Pizza>(`pizzas/${pizza.id}`)
  //           return Observable.fromPromise( ref.set(pizza) )
  //       })
  //       .map(() => {
  //           return new actions.Success()
  //       })
}





  // Listen for the 'QUERY' action, must be the first effect you trigger

  // @Effect() query$: Observable<Action> = this.actions$.ofType(actions.QUERY)
  //   .switchMap(action => {
  //       const ref = this.afs.collection<fromPizza.Pizza>('pizzas')
  //       return ref.snapshotChanges().map(arr => {
  //           return arr.map( doc => {
  //               const data = doc.payload.doc.data()
  //               return { id: doc.payload.doc.id, ...data } as fromPizza.Pizza
  //           })
  //       })
  //   })
  //   .map(arr => {
  //       console.log(arr)
  //       return new actions.AddAll(arr)
  //   })

    // Listen for the 'CREATE' action



    // Listen for the 'UPDATE' action

    // @Effect() update$: Observable<Action> = this.actions$.ofType(actions.UPDATE)
    //     .map((action: actions.Update) => action)
    //     .switchMap(data => {
    //         const ref = this.afs.doc<fromPizza.Pizza>(`pizzas/${data.id}`)
    //         return Observable.fromPromise( ref.update(data.changes) )
    //     })
    //     .map(() => {
    //         return new actions.Success()
    //     })

    // Listen for the 'DELETE' action

    // @Effect() delete$: Observable<Action> = this.actions$.ofType(actions.DELETE)
    //     .map((action: actions.Delete) => action.id )
    //     .switchMap(id => {
    //         const ref = this.afs.doc<fromPizza.Pizza>(`pizzas/${id}`)
    //         return Observable.fromPromise( ref.delete() )
    //     })
    //     .map(() => {
    //         return new actions.Success()
    //     })



