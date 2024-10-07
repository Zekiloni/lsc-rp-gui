import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import {
   SessionStorageService,
   StorageItemKey,
} from '../service/services';

export const authGuard: CanActivateFn = (route, state) => {
   const token = inject(SessionStorageService).retrieve(StorageItemKey.AccessToken);
   console.log('authGuard - Token:', token); // Debug log
   return !!token;
};
