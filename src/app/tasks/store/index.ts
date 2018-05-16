
import { TaskState } from './tasks.state';
import { PomoState } from './pomos.state';

export const CollectionState = [TaskState, PomoState];

export * from '../store/task.actions';
export * from './tasks.state';
export * from './pomos.state';


