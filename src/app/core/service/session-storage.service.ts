import { Injectable } from '@angular/core';

export const enum StorageItemKey {
   AccessToken = 'ACCESS_TOKEN',
}

@Injectable({
   providedIn: 'root',
})
export class SessionStorageService {
   constructor() {
   }

   retrieve<T>(key: string) {
      return sessionStorage.getItem(key) as T;
   }

   save(key: string, value: any) {
      sessionStorage.setItem(key, (typeof value === 'object') ? JSON.stringify(value) : value);
   }

   delete(key: string) {
      sessionStorage.removeItem(key);
   }
}
