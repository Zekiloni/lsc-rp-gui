import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { LocalStorageService, StorageItemKey } from '../service/local-storage.service';
import { AuthenticationApiService } from '../api/authenticationApi.service';
import { map } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
   const token = inject(LocalStorageService).retrieve(
      StorageItemKey.AccessToken,
   );

   if (!token) {
      inject(Router).navigate(['']);
   }

   const isAdmin = inject(AuthenticationApiService).validate()
      .pipe(map(account => account.admin || 0))
      .subscribe(admin => {
         if (!admin) {

         }
      });


   return true;
};
