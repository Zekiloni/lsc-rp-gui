import { Routes } from '@angular/router';

export const routes: Routes = [
   {
      title: 'Authorization',
      path: 'auth',
      loadComponent: () =>
         import('./pages/auth-page/auth-page.component').then(
            (m) => m.AuthPageComponent
         ),
   },
];
