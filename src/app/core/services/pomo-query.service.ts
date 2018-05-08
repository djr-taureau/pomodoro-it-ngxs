import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromTasks from '../../reducers';
import * as collection from '../../tasks/actions/collection';
import * as taskPomo from '../../tasks/actions/task';
import { Task } from '../../tasks/models/task';
import { Pomo } from '../../tasks/models/pomo';

@Injectable()
export class PomoQueryService {

  // selectPomos$ = this.store.select(state = state.tasks.pomos.entities)

  constructor(private store: Store<fromTasks.State>) { }

}

