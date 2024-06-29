import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LocalStorageService, StorageItemKey } from '../service/local-storage.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(LocalStorageService).retrieve(
     StorageItemKey.AccessToken,
  );

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authReq);
};
