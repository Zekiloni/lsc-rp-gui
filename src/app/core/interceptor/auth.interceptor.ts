import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SessionStorageService, StorageItemKey } from '../service/session-storage.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
   const token = inject(SessionStorageService).retrieve<string | null>(
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
