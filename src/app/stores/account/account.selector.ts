import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AccountState } from './account.reducer';

export const selectAccountState =
   createFeatureSelector<AccountState>('account');

export const selectIsAuthenticated = createSelector(
   selectAccountState,
   (state: AccountState) => state.isAuthenticated
);

export const selectAccount = createSelector(
   selectAccountState,
   (state: AccountState) => state.account
);
