import { Routes } from '@angular/router';
import { authGuard } from './core/guard/auth.guard';

export const routes: Routes = [
   {
      path: '',
      loadComponent: () =>
         import('./layouts/main-layout').then(
            (m) => m.MainLayoutComponent,
         ),
      children: [
         {
            title: 'Home',
            path: '',
            loadComponent: () =>
               import('./pages/home-page').then((m) => m.HomePageComponent),
         },
         {
            title: 'Dashboard',
            path: 'dashboard',
            canActivate: [authGuard],
            loadComponent: () =>
               import('./pages/dashboard-page').then((m) => m.DashboardPageComponent),
         },

         {
            path: '**',
            pathMatch: 'full',
            loadComponent: () =>
               import('./pages/not-found-page').then((m) => m.NotFoundPageComponent),
         },
      ],

   },
];
