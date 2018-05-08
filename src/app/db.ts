import { DBSchema } from '@ngrx/db';

/**
 * ngrx/db uses a simple schema config object to initialize stores in IndexedDB.
 */
export const schema: DBSchema = {
  version: 1,
  name: 'tasks_app',
  stores: {
    tasks: {
      autoIncrement: true,
      primaryKey: 'id',
    },
    pomos: {
      autoIncrement: true,
      primaryKey: 'id',
    },
  },
};
