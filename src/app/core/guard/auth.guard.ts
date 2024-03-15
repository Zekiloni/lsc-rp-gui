import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {
   LocalStorageService,
   StorageItemKey,
} from '../service/services';

export const authGuard: CanActivateFn = (route, state) => {
   const token = inject(LocalStorageService).retrieve(
      StorageItemKey.AccessToken
   );

   if (!token) {
      inject(Router).navigate(['']);
   }

   return !!token;
};
