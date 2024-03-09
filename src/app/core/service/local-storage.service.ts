import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {
   constructor() {}

   retrieve<T>(key: string) {
      return localStorage.getItem(key) as T;
   }

   save(key: string, value: any) {
      localStorage.setItem(key, JSON.stringify(value));
   }

   delete(key: string) {
      localStorage.removeItem(key);
   }
}
