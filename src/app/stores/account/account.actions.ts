import { createAction, props } from '@ngrx/store';
import { Account } from '../../core/model/models';

export const setAuthenticated = createAction(
   '[Account] Set is Authenticated',
   props<{ isAuthenticated: boolean }>()
);

export const setAccount = createAction(
   '[Account] Set Account',
   props<{ account: Account | null }>()
);
