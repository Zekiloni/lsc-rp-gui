import { Injectable } from '@angular/core';

export const enum StorageItemKey {
   AccessToken = 'ACCESS_TOKEN',
}

@Injectable({
   providedIn: 'root',
})
export class LocalStorageService {
   constructor() {}

   retrieve<T>(key: string) {
      return localStorage.getItem(key) as T;
   }

   save(key: string, value: any) {
      console.log(`LocalStorageService.save ${key} = ${value}`);
      localStorage.setItem(key, JSON.stringify(value));
   }

   delete(key: string) {
      localStorage.removeItem(key);
   }
}
