import { map } from 'rxjs';
import { Store } from '@ngrx/store';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { selectIsAdministrator } from '../../stores/account/account.selector';
import { LocalStorageService, StorageItemKey } from '../service/local-storage.service';

export const adminGuard: CanActivateFn = (route, state) => {
   const router = inject(Router), store = inject(Store);

   const token = inject(LocalStorageService).retrieve(
      StorageItemKey.AccessToken,
   );

   if (!token) {
      router.navigate(['']);
   }

   store.select(selectIsAdministrator)
      .pipe(map(adminLevel => adminLevel != null && adminLevel > 0))
      .subscribe(isAdministrator => {
         if (!isAdministrator) {
            router.navigate(['']);
         }
      })

   return !!token;
};
