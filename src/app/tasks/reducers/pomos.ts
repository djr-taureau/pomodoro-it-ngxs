import { createSelector } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
// import { Task } from '../models/task';
import { Pomo } from '../models/pomo';
import { CollectionActions, CollectionActionTypes } from '../actions/collection';
import {  PomoActions, PomoActionTypes } from '../actions/pomo';


export interface State extends EntityState<Pomo> {
  selectedPomoId: string | null;
}


export const adapter: EntityAdapter<Pomo> = createEntityAdapter<Pomo>({
  selectId: (pomo: Pomo) => pomo.id,
  sortComparer: false,
});


export const initialState: State = adapter.getInitialState({
  selectedPomoId: null,
});

export function reducer(
  state = initialState,
  action: PomoActions | CollectionActions
): State {
  switch (action.type) {
    case PomoActionTypes.SearchComplete:
    case CollectionActionTypes.LoadPomosSuccess: {

      return adapter.addMany(action.payload, {
        ...state,
        selectedPomoId: state.selectedPomoId,
      });
    }

    case PomoActionTypes.Load: {

      return adapter.addOne(action.payload, {
        ...state,
        selectedPomoId: state.selectedPomoId,
      });
    }

    case PomoActionTypes.Select: {
      return {
        ...state,
        selectedPomoId: action.payload,
      };
    }

    default: {
      return state;
    }
  }
}


export const getSelectedPomoId = (state: State) => state.selectedPomoId;
