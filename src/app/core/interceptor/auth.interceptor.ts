import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LocalStorageService, StorageItemKey } from '../service/local-storage.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
   const token = inject(LocalStorageService).retrieve<string | null>(
      StorageItemKey.AccessToken,
   );

   if (token && token.length > 0) {
      const authReq = req.clone({
         setHeaders: {
            Authorization: `Bearer ${token}`,
         },
      });

      return next(authReq);
   }

   return next(req);
};
