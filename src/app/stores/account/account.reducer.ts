import { createReducer, on } from '@ngrx/store';
import * as AccountActions from './account.actions';

import { Account } from '../../core/model/models';

export interface AccountState {
   isAuthenticated: boolean;
   account: Account | null;
}

const initialState: AccountState = {
   isAuthenticated: false,
   account: null,
};

export const accountReducer = createReducer(
   initialState,
   on(AccountActions.setAuthenticated, (state, { isAuthenticated }) => ({
      ...state,
      isAuthenticated,
   })),
   on(AccountActions.setAccount, (state, { account }) => ({
      ...state,
      account,
   }))
);
