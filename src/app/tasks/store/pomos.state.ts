import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Pomo } from '../models/pomo';
import { TasksModule } from '../tasks.module';
import * as pomo from '../store/pomo.actions';
import { TodoistTasksService } from '../../services/todoist-tasks';
import { TaskService } from '../../services/task-service';
import { AuthService } from '../../auth/services/auth.service';
import { asapScheduler, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export class PomoStateModel {
  loaded: boolean;
  loading: boolean;
  pomos: Pomo[];
  selectedPomoId: string;
}

// initial state
@State<PomoStateModel>({
  name: 'Pomos',
  defaults: {
   loaded: false,
   loading: false,
   pomos: [],
   selectedPomoId: null
  }
})

export class PomoState {

constructor(private todoist: TodoistTasksService,
            private auth: AuthService,
            private taskService: TaskService) {}


  @Selector()
  static Pomos(state: PomoStateModel) {
    return state.pomos;
  }

  @Selector()
  static Loaded(state: PomoStateModel) {
    return state.loaded;
  }

  @Selector()
  static SelectedPomoId(state: PomoStateModel) {
    return state.selectedPomoId;
  }

  @Selector()
  static SelectedPomo(state: PomoStateModel): Pomo {
    return state.pomos.find(
      (pomo: Pomo) => pomo.id === state.selectedPomoId
    );
  }

  @Action(pomo.Load)
  loadPomos({ patchState, dispatch }: StateContext<PomoStateModel>) {
    patchState({ loading: true });
    return this.taskService
      .getPomos$()
      .pipe(
        map((Pomos: Pomo[]) =>
          asapScheduler.schedule(() =>
            dispatch(new pomo.LoadPomosSuccess(Pomos))
          )
        ),
        catchError(error =>
          of(
            asapScheduler.schedule(() =>
              dispatch(new pomo.LoadPomosFail(error))
            )
          )
        )
      );
  }

  @Action(pomo.LoadPomosSuccess)
  loadPomosSuccess(
    { patchState }: StateContext<PomoStateModel>,
    { payload }: pomo.LoadPomosSuccess
  ) {
    patchState({ pomos: payload, loaded: true, loading: false });
  }

  @Action(pomo.LoadPomosFail)
  loadPomosFail(
    { dispatch }: StateContext<PomoStateModel>,
    { payload }: pomo.LoadPomosFail
  ) {
    dispatch({ loaded: false, loading: false });
  }

  @Action(pomo.SelectPomo)
  selectedPomo(
    { patchState }: StateContext<PomoStateModel>,
    { payload }: pomo.SelectPomo
  ) {
    patchState({ selectedPomoId: payload });
  }

}



